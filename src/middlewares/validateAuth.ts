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
            message: "Email and password are required",
            status: 400
        })
    }

    next()
}

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers?.authorization

    if (!authorization) {
        return res.status(401).json({
            message: 'Token not provided',
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

        if (req.user.role !== "admin" && permissions && !permissions.access_system) {
            return res.status(403).json({
                message: 'You do not have permission to access the system. Blocked by Administrator'
            })
        }


    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
        })
    }



    next()
}


export {
    validateLogin,
    validateToken
}