import { Router } from 'express'
import clientsRoutes from './client.routes'
import adminRoutes from './admin.routes'

const routes = Router()

routes.use('/clients', clientsRoutes)
routes.use('/administrator', adminRoutes)

export default routes
