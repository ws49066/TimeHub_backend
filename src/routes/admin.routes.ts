import { validadeAdmin, validateAdminUpdate } from '@/middlewares/validateAdmin';
import { Router } from 'express'
import { AdminController } from '../controllers/AdminController'
import { validateToken } from '@/middlewares/validateAuth'
import authRoutes from './auth.routes';
import roomRoutes from './room.routes';
import clientPermissionRoutes from './permission.routes';

const adminRoutes = Router()

adminRoutes.use(authRoutes)
adminRoutes.use(roomRoutes)
adminRoutes.use(clientPermissionRoutes)
adminRoutes.post('/register', validadeAdmin, AdminController.register)
adminRoutes.put('/edit', validateToken, validateAdminUpdate, AdminController.edit)

export default adminRoutes
