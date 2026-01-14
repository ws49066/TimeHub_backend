import { RoomController } from '@/controllers/RoomController'
import { validateToken } from '@/middlewares/validateAuth'
import { validadeRoom } from '@/middlewares/validateRoom'
import { Router } from 'express'


const roomRoutes = Router()

roomRoutes.post("/createRoom", validateToken, validadeRoom,RoomController.createRoom)
roomRoutes.put("/editRoom", validateToken, validadeRoom,RoomController.editRoom)

export default roomRoutes