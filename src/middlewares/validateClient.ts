import { Response, Request, NextFunction } from "express";

const validadeClient = async (req: Request, res: Response, next: NextFunction) => {
    const { nome, sobrenome, email, password, cep } = req.body

    if (!nome || !sobrenome || !email || !password || !cep) {
        return res.status(400).json({
            message: 'Campos obrigatórios não informados',
        })
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/

    if (!nameRegex.test(nome) || !nameRegex.test(sobrenome)) {
        return res.status(400).json({
            message: 'Nome e sobrenome não podem conter números ou caracteres inválidos',
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export {
    validadeClient
}