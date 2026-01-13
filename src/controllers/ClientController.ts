import { Request, Response } from 'express'
import { Client } from '../models/ClientModel'
import bcrypt from 'bcrypt'

export class ClientController {
  static async register(req: Request, res: Response) {
    try {
      const {
        nome,
        sobrenome,
        email,
        password,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      } = req.body


      const userExists = await Client.findOne({ where: { email } })

      if (userExists) {
        return res.status(409).json({
          message: 'E-mail já cadastrado',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 8)

      const user = await Client.create({
        nome,
        sobrenome,
        email,
        password: hashedPassword,
        cep,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      })

      return res.status(201).json({
        message: "Cliente Cadadastro com Sucesso",
        status: 201,
        // data: {
        //   id: user.id,
        //   nome: user.nome,
        //   sobrenome: user.sobrenome,
        //   email: user.email,
        //   createdAt: user.createdAt,
        // }
      })

    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message: 'Erro interno ao cadastrar usuário',
      })
    }
  }
}
