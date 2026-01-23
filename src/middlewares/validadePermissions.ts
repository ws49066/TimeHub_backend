import { Response, Request, NextFunction } from "express";

const validadePermission = async (req: Request, res: Response, next: NextFunction) => {

    const allowFields = [
        'access_system',
        'manage_users',
        'view_logs',
        'create_appointment',
        'clientId'
    ]

    const payload = req.body

    if (!payload || Object.keys(payload).length === 0) {
        return res.status(400).json({
            message: 'Nenhuma permissão foi informada para alteração',
        })
    }


    if (!payload.clientId) {
        return res.status(400).json({
            message: 'Campos clientId não informados',
        })
    }


    for (const key of Object.keys(payload)) {

        if (!allowFields.includes(key)) {
            return res.status(400).json({
                message: `Campo inválido: ${key}`,
            })
        }

        if (key !== "clientId" && typeof payload[key] !== 'boolean') {
            return res.status(400).json({
                message: `O campo "${key}" deve ser boolean (true ou false)`,
            })
        }
    }


    next()
}


export {
    validadePermission
}