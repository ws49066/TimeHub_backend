import { Router } from 'express'
import { ClientController } from '../controllers/ClientController'
import { validadeClient, validateClienUpdate } from '@/middlewares/validateClient'
import { validateToken } from '@/middlewares/validateAuth'

const userRoutes = Router()

userRoutes.post('/register', validadeClient, ClientController.register)
userRoutes.put('/edit', validateToken, validateClienUpdate, ClientController.edit)

export default userRoutes
