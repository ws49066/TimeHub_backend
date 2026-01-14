import { validadeAdmin, validateAdminUpdate } from '@/middlewares/validateAdmin';
import { Router } from 'express'
import { AdminController } from '../controllers/AdminController'
import { validateToken } from '@/middlewares/validateAuth'
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';

const adminRoutes = Router()

adminRoutes.use(authRoutes)
adminRoutes.use(roomRoutes)
adminRoutes.post('/register', validadeAdmin, AdminController.register)
adminRoutes.put('/edit', validateToken, validateAdminUpdate, AdminController.edit)

export default adminRoutes
