import { Response, Request, NextFunction } from "express";



const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validadeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, sobrenome, email, password } = req.body

    if (!nome || !sobrenome || !email || !password) {
        return res.status(400).json({
            message: 'Required fields not provided',
        })
    }


    if (!nameRegex.test(nome) || !nameRegex.test(sobrenome)) {
        return res.status(400).json({
            message: 'Name and surname cannot contain numbers or invalid characters',
        })
    }


    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email',
        })
    }

    next()

}

const validateAdminUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const {
        nome,
        sobrenome,
        email
    } = req.body

    if (
        !nome &&
        !sobrenome &&
        !email
    ) {
        return res.status(400).json({
            message: 'Provide at least one field for update',
        })
    }


    if (nome && !nameRegex.test(nome)) {
        return res.status(400).json({
            message: 'Name and surname cannot contain numbers or invalid characters',
        })
    }

    if (sobrenome && !nameRegex.test(sobrenome)) {
        return res.status(400).json({
            message: 'Name and surname cannot contain numbers or invalid characters',
        })
    }

    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email',
        })
    }


    next()
}

const validadeUserAdmin =  async (req: Request, res: Response, next: NextFunction) => {
    if(req.user?.role !== 'admin') {
        return res.status(403).json({
            message: 'You do not have permission to perform this action',
            status: 403
        })
    }

    next()
}

export {
    validadeAdmin,
    validateAdminUpdate,
    validadeUserAdmin
}