import { Router } from 'express'
import { ClientController } from '../controllers/ClientController'
import { validadeClient, validateClientUpdate } from '@/middlewares/validateClient'
import { validateToken } from '@/middlewares/validateAuth'
import authRoutes from './auth.routes'

const userRoutes = Router()

userRoutes.use(authRoutes)
userRoutes.post('/register', validadeClient, ClientController.register)
userRoutes.put('/edit', validateToken, validateClientUpdate, ClientController.edit)

export default userRoutes
