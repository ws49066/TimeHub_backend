import { RoomController } from '@/controllers/RoomController'
import { validadeUserAdmin } from '@/middlewares/validateAdmin'
import { validateToken } from '@/middlewares/validateAuth'
import { validadeRoom } from '@/middlewares/validateRoom'
import { Router } from 'express'


const roomRoutes = Router()

roomRoutes.get("/rooms", validateToken, validadeUserAdmin, RoomController.allRooms)
roomRoutes.post("/createRoom", validateToken, validadeUserAdmin, validadeRoom,RoomController.createRoom)
roomRoutes.put("/editRoom", validateToken, validadeUserAdmin, validadeRoom,RoomController.editRoom)

export default roomRoutes