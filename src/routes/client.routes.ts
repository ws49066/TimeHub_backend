import { Router } from 'express'
import { ClientController } from '../controllers/ClientController'
import { validadeClient } from '@/middlewares/validateClient'

const userRoutes = Router()

userRoutes.post('/register', validadeClient, ClientController.register)

export default userRoutes
