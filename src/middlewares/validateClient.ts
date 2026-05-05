import { getPermission } from "@/utils/createPermission";
import { Response, Request, NextFunction } from "express";



const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validadeClient = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, sobrenome, email, password, cep } = req.body

    if (!nome || !sobrenome || !email || !password || !cep) {
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

    if (!/^\d+$/.test(cep)) {
        return res.status(400).json({
            message: 'Invalid ZIP code',
        })
    }

    next()

}

const validateClientUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const {
        nome,
        sobrenome,
        email,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
    } = req.body

    if (
        !nome &&
        !sobrenome &&
        !email &&
        !cep &&
        !endereco &&
        !numero &&
        !complemento &&
        !bairro &&
        !cidade &&
        !estado
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

    if (cep && !/^\d+$/.test(cep)) {
        return res.status(400).json({
            message: 'Invalid ZIP code',
        })
    }

    next()
}

const validadeUserClient = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'client') {
        return res.status(403).json({
            message: 'You do not have permission to perform this action',
            status: 403
        })
    }

    next()
}


export {
    validadeClient,
    validateClientUpdate,
    validadeUserClient
}