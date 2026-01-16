import { SchedulingController } from '@/controllers/SchedulingController'
import { validateToken } from '@/middlewares/validateAuth'
import { validadeUserClient } from '@/middlewares/validateClient'
import { Router } from 'express'


const schedulingRoutes = Router()

schedulingRoutes.post("/", validateToken, validadeUserClient, SchedulingController.createScheduling) // Just user can do this

schedulingRoutes.get("/", validateToken, SchedulingController.listScheduling) // both

schedulingRoutes.put("/", validateToken, SchedulingController.updateScheduling) // both admin change status={Aproved // Cancel} / client just Cancel your scheduling


export default schedulingRoutes