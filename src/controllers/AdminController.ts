import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Admin } from '@/models/AdminModel'

export class AdminController {
  static async register(req: Request, res: Response) {
    try {
      const {
        nome,
        sobrenome,
        email,
        password
      } = req.body


      const userExists = await Admin.findOne({ where: { email } })

      if (userExists) {
        return res.status(409).json({
          message: 'E-mail já cadastrado',
        })
      }

      const hashedPassword = await bcrypt.hash(password, 8)

      await Admin.create({
        nome,
        sobrenome,
        email,
        password: hashedPassword
      })

      return res.status(201).json({
        message: "Usuario Cadadastro com Sucesso",
        status: 201,
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
      const userId = req.user?.userId
      const userEmail = req.user?.email
      const userRole = req.user?.role


      const {
        nome,
        sobrenome,
        email,
        password
      } = req.body

      const admin = await Admin.findByPk(userId)

      if (!admin) {
        return res.status(404).json({
          message: 'Usuário não encontrado',
        })
      }

      if (
        admin.id === Number(userId) &&
        admin.email === userEmail &&
        admin.role === userRole
      ) {

        await admin.update({
          nome,
          sobrenome,
          email,
          password
        })
      } else {
        return res.status(401).json({
          message: 'Token inválido',
        })
      }

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
