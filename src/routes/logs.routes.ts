import { LogController } from '@/controllers/LogsController'
import { validateToken } from '@/middlewares/validateAuth'
import { Router } from 'express'


const logsRoutes = Router()

logsRoutes.get("/", validateToken, LogController.allLogs)


export default logsRoutes