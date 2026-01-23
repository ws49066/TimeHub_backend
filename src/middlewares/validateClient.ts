import { getPermission } from "@/utils/createPermission";
import { Response, Request, NextFunction } from "express";



const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validadeClient = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, sobrenome, email, password, cep } = req.body

    if (!nome || !sobrenome || !email || !password || !cep) {
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

    if (!/^\d+$/.test(cep)) {
        return res.status(400).json({
            message: 'CEP inválido',
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

    if (cep && !/^\d+$/.test(cep)) {
        return res.status(400).json({
            message: 'CEP inválido',
        })
    }

    next()
}

const validadeUserClient = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'client') {
        return res.status(403).json({
            message: 'Você não tem permissão para executar essa ação',
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