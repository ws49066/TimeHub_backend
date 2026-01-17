import { authConfig } from "@/configs/auth";
import { IPermissionCreation } from "@/models/PermissionModel";
import { getPermission } from "@/utils/createPermission";
import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken'

interface TokenPayload {
    id: string,
    email: string,
    role: string,
    permissions: IPermissionCreation
}

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: "Email e senha são obrigatórios",
            status: 400
        })
    }

    next()
}

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers?.authorization

    if (!authorization) {
        return res.status(401).json({
            message: 'Token não informado',
        })
    }

    const [, token] = authorization.split(" ")

    try {
        const tokenDecoded = verify(token, authConfig.jwt.secret) as TokenPayload

        req.user = {
            userId: String(tokenDecoded.id),
            email: String(tokenDecoded.email),
            role: String(tokenDecoded.role)
        }

        const permissions = await getPermission(String(req.user.userId))

        if (permissions && !permissions.access_system) {
            return res.status(403).json({
                message: 'Você não tem permissao para acessar o sistema, Bloqueado pelo Administrador'
            })
        }


    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido',
        })
    }



    next()
}


export {
    validateLogin,
    validateToken
}