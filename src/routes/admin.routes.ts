import { validadeAdmin, validateAdminUpdate } from '@/middlewares/validateAdmin';
import { Router } from 'express'
import { AdminController } from '../controllers/AdminController'
import { validateToken } from '@/middlewares/validateAuth'
import authRoutes from './auth.routes';

const adminRoutes = Router()

adminRoutes.use(authRoutes)
adminRoutes.post('/register', validadeAdmin, AdminController.register)
adminRoutes.put('/edit', validateToken, validateAdminUpdate, AdminController.edit)

export default adminRoutes
