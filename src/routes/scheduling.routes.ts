import { validateToken } from '@/middlewares/validateAuth'
import { Router } from 'express'


const schedulingRoutes = Router()

schedulingRoutes.post("/createScheduling", validateToken)
schedulingRoutes.get("/listAllScheduling", validateToken)
schedulingRoutes.put("/cancelScheduling", validateToken)

export default schedulingRoutes