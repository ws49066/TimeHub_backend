import { Response, Request, NextFunction } from "express";



const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validadeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, sobrenome, email, password } = req.body

    if (!nome || !sobrenome || !email || !password) {
        return res.status(400).json({
            message: 'Campos obrigatórios não informados',
        })
    }


    if (!nameRegex.test(nome) || !nameRegex.test(sobrenome)) {
        return res.status(400).json({
            message: 'Nome e sobrenome não podem conter números ou caracteres inválidos',
        })
    }


    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'E-mail inválido',
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
            message: 'Informe ao menos um campo para atualização',
        })
    }


    if (nome && !nameRegex.test(nome)) {
        return res.status(400).json({
            message: 'Nome e sobrenome não podem conter números ou caracteres inválidos',
        })
    }

    if (sobrenome && !nameRegex.test(sobrenome)) {
        return res.status(400).json({
            message: 'Nome e sobrenome não podem conter números ou caracteres inválidos',
        })
    }

    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            message: 'E-mail inválido',
        })
    }


    next()
}

export {
    validadeAdmin,
    validateAdminUpdate
}