import { Request, Response } from "express";
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Client } from "@/models/ClientModel";
import { authConfig } from "@/configs/auth";
import { createLog } from "@/utils/createLog";
import { Admin } from "@/models/AdminModel";
import { ClientPermission } from "@/models";
import { IPermissionCreation } from "@/models/PermissionModel";

const invalidCredentials = (res: Response) => {
    return res.status(401).json({
        message: "Invalid email or password",
        status: 401
    });
}

const generateToken = (user: { id: number; email: string; role: string ; nome: string; sobrenome:string }, permissions: IPermissionCreation={}) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            nome: user.nome,
            sobrenome: user.sobrenome,
            permissions
        },
        authConfig.jwt.secret,
        {
            expiresIn: '1d'

        }
    );
}

const successResponse = (res: Response, user: any, token: string) => {
    return res.status(200).json({
        message: 'Login successfully completed',
        data: {
            nome: user.nome,
            sobrenome: user.sobrenome,
            email: user.email,
            token
        }
    });
}

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password, role = "client" } = req.body

            if (role === "admin") {
                const admin = await Admin.findOne({ where: { email } })

                if (!admin || !(await compare(password, admin.password))) {
                    return invalidCredentials(res);
                }

                const token = generateToken(admin);
                return successResponse(res, admin, token);

            }

            const client = await Client.findOne({
                where: { email },
                include: [{ model: ClientPermission, as: 'permissions' }
                ]
            });

            if (!client || !(await compare(password, client.password))) {
                return invalidCredentials(res);
            }
            

            if (!client.permissions?.access_system) {
                return res.status(403).json({
                    message: 'You do not have permission to access the system. Blocked by Administrator',
                    status: 403
                });
            }


            const token = generateToken(client, client.permissions)

            await createLog({
                clientId: client.id,
                action: 'Login',
                module: 'My Account',
            })

            return successResponse(res, client, token)


        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Error during login',
            })
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const userId = req.user?.userId
            const callLog = req.user?.role === "client"

            if (callLog) {
                await createLog({
                    clientId: Number(userId),
                    action: 'Logout',
                    module: 'My Account',
                })
            }

            res.status(200).json({
                message: "Logout successfully completed",
                status: 200
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Error during logout',
                status: 500
            })
        }
    }
}
