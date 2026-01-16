import { Router } from 'express'
import clientsRoutes from './client.routes'
import adminRoutes from './admin.routes'
import logsRoutes from './logs.routes'
import schedulingRoutes from './scheduling.routes'

const routes = Router()

routes.use('/clients', clientsRoutes)
routes.use('/administrator', adminRoutes)
routes.use('/logs', logsRoutes)
routes.use('/scheduling', schedulingRoutes)

export default routes
