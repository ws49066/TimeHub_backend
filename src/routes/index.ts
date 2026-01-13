import { Router } from 'express'
import clientsRoutes from './client.routes'
import authRoutes from './auth.routes'

const routes = Router()

routes.use('/clients', clientsRoutes)
routes.use('/auth', authRoutes)

export default routes
