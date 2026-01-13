import { Request, Response, NextFunction } from "express";

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({
            message: "Email e senha são obrigatórios",
            status: 400
        })
    }

    next()
}

export {
    validateLogin
}