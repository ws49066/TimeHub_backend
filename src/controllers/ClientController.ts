import { Request, Response } from 'express'
import { Client } from '../models/ClientModel'
import bcrypt from 'bcrypt'
import { createLog } from '@/utils/createLog'
import { createPermission } from '@/utils/createPermission'
import { ClientPermission } from '@/models/PermissionModel'

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

      await createPermission({
        clientId: user.id
      })

      return res.status(201).json({
        message: "Cliente Cadadastro com Sucesso",
        status: 201
      })

    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message: 'Erro interno ao cadastrar Cliente',
      })
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const clientId = req.user?.userId
      const clientEmail = req.user?.email
      const clientRole = req.user?.role

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

      const client = await Client.findByPk(clientId,
        {
          include: [
            {
              model: ClientPermission,
              as: 'permissions'
            }
          ]
        })



      if (!client) {
        return res.status(404).json({
          message: 'Cliente não encontrado',
        })
      }

      if (
        client.id === Number(clientId) &&
        client.email === clientEmail &&
        client.role === clientRole
      ) {
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

      } else {
        return res.status(401).json({
          message: 'Token inválido',
        })
      }

      if (!client.permissions?.access_system) {
        return res.status(403).json({
          message: 'Não foi possivel atualizar os dados. Acesso ao sistema bloqueado pelo Administrador',
          status:403
        })
      }

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
        message: 'Erro ao atualizar dados do Cliente',
      })
    }
  }
}
