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
          message: 'Email already registered',
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
        numero:parseInt(numero),
        complemento,
        bairro,
        cidade,
        estado,
      })

      await createPermission({
        clientId: user.id
      })

      return res.status(201).json({
        message: "Client registered successfully",
        status: 201
      })

    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message: 'Internal error when registering client',
      })
    }
  }

  static async getInfo(req: Request, res: Response) {
    const clientId = req.user?.userId

    try {
      const client = await Client.findByPk(clientId)

      return res.status(200).json({
        message: "success",
        status: 200,
        data: client
      })
    } catch (error) {
      return res.status(403).json({
        message: 'Unable to retrieve client information',
        status: 403
      })
    }
  }

  static async edit(req: Request, res: Response) {
    try {
      const clientId = req.user?.userId
      const clientEmail = req.user?.email

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
          message: 'Client not found',
        })
      }

      if (!client.permissions?.access_system) {
        return res.status(403).json({
          message: 'Unable to update data. System access blocked by Administrator',
          status: 403
        })
      }

      if (
        client.id === Number(clientId) &&
        client.email === clientEmail
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
          message: 'Invalid token',
        })
      }



      await createLog({
        clientId: client.id,
        action: 'Data update',
        module: 'My Account',
      })

      return res.json({
        message: 'Data updated successfully',
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Error updating client data',
      })
    }
  }
}
