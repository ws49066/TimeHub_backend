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
          message: 'Email already registered',
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
        message: "User registered successfully",
        status: 201,
      })

    } catch (error) {
      console.error(error)

      return res.status(500).json({
        message: 'Internal error when registering user',
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
          message: 'User not found',
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
          message: 'Invalid token',
        })
      }

      return res.json({
        message: 'Data updated successfully',
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: 'Error updating user data',
      })
    }
  }
}
