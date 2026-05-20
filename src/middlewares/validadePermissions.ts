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
            message: 'No permission was provided for change',
        })
    }


    if (!payload.clientId) {
        return res.status(400).json({
            message: 'clientId field not provided',
        })
    }


    for (const key of Object.keys(payload)) {

        if (!allowFields.includes(key)) {
            return res.status(400).json({
                message: `Invalid field: ${key}`,
            })
        }

        if (key !== "clientId" && typeof payload[key] !== 'boolean') {
            return res.status(400).json({
                message: `The "${key}" field must be boolean (true or false)`,
            })
        }
    }


    next()
}


export {
    validadePermission
}