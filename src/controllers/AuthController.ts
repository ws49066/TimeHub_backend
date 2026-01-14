import { Request, Response } from "express";
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Client } from "@/models/ClientModel";
import { authConfig } from "@/configs/auth";
import { createLog } from "@/utils/createLog";
import { Admin } from "@/models/AdminModel";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password, role = "client" } = req.body
            let callLog = true

            let user

            if (role === "admin") {
                user = await Admin.findOne({ where: { email } });
                callLog = false
            } else {

                user = await Client.findOne({ where: { email } });
            }
        

            if (!user) {
                return res.status(401).json({
                    message: "Email ou senha Inválidos",
                    status: 401
                })
            }

            const passwordCompareMatch = compare(password, user.password)

            if (!passwordCompareMatch) {
                return res.status(401).json({
                    message: "Email ou senha Inválidos",
                    status: 401
                })
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role

                },
                authConfig.jwt.secret,
                { expiresIn: '1d' }
            )

            if (callLog) {
                await createLog({
                    clientId: user.id,
                    action: 'Login',
                    module: 'Minha Conta',
                })
            }

            return res.status(200).json({
                message: 'Login realizado com Sucesso',
                data: {
                    nome: user.nome,
                    sobrenome: user.sobrenome,
                    email: user.email,
                    token
                }
            })


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

            if(callLog){
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
