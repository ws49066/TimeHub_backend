import { Request, Response } from 'express'
import { Client } from '../models/ClientModel'
import bcrypt from 'bcrypt'
import { userInfo } from 'node:os'
import { createLog } from '@/utils/createLog'

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

  static async edit(req: Request, res: Response) {
    try {
      const clientId = req.user?.userId

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

      const client = await Client.findByPk(clientId)

      if (!client) {
        return res.status(404).json({
          message: 'Usuário não encontrado',
        })
      }

      await client.update({
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
        estado
      })

      await createLog({
        clientId: client.id,
        action: 'Atualização de dados',
        module: 'Minha Conta',
      })

      return res.json({
        message: 'Dados atualizados com sucesso',
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Erro ao atualizar dados do usuário',
      })
    }
  }
}
