import { Router } from 'express'
import { ClientController } from '../controllers/ClientController'
import { validadeClient, validadeUserClient, validateClientUpdate } from '@/middlewares/validateClient'
import { validateToken } from '@/middlewares/validateAuth'
import authRoutes from './auth.routes'

const userRoutes = Router()

userRoutes.use(authRoutes)
userRoutes.post('/register', validadeClient, ClientController.register)
userRoutes.put('/edit', validateToken, validateClientUpdate, validadeUserClient, ClientController.edit)
userRoutes.get('/info', validateToken, validadeUserClient, ClientController.getInfo)

export default userRoutes
