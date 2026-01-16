import { validateToken } from '@/middlewares/validateAuth'
import { validadeUserClient } from '@/middlewares/validateClient'
import { Router } from 'express'


const schedulingRoutes = Router()

schedulingRoutes.post("/", validateToken, validadeUserClient) // Just user can do this

schedulingRoutes.get("/", validateToken) // both

schedulingRoutes.put("/", validateToken) // both admin change status={Aproved // Cancel} / client just Cancel your scheduling


export default schedulingRoutes