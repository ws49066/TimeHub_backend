import { SchedulingController } from '@/controllers/SchedulingController'
import { validadeFields, validadeFieldStatus } from '@/middlewares/validadeScheduling'
import { validateToken } from '@/middlewares/validateAuth'
import { validadeUserClient } from '@/middlewares/validateClient'
import { Router } from 'express'


const schedulingRoutes = Router()

schedulingRoutes.post("/", validateToken, validadeUserClient, validadeFields, SchedulingController.createScheduling)


schedulingRoutes.get("/", validateToken, SchedulingController.listScheduling)

schedulingRoutes.get("/availability", validateToken, SchedulingController.availability)

schedulingRoutes.put("/", validateToken, validadeFieldStatus, SchedulingController.updateScheduling)

export default schedulingRoutes