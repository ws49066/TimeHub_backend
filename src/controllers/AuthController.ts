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
        message: "Email ou senha inválidos",
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
        message: 'Login realizado com sucesso',
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
                    message: 'Você não tem permissao para acessar o sistema, Bloqueado pelo Administrador',
                    status: 403
                });
            }


            const token = generateToken(client, client.permissions)

            await createLog({
                clientId: client.id,
                action: 'Login',
                module: 'Minha Conta',
            })

            return successResponse(res, client, token)


        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao realizar login',
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
                    module: 'Minha Conta',
                })
            }

            res.status(200).json({
                message: "Logout Realizado com Sucesso",
                status: 200
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Erro ao realizar logout',
                status: 500
            })
        }
    }
}
