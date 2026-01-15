import { PermissionController } from '@/controllers/PermissionController'
import { validadePermission } from '@/middlewares/validadePermissions'
import { validateToken } from '@/middlewares/validateAuth'
import { Router } from 'express'


const clientPermissionRoutes = Router()

clientPermissionRoutes.put("/editClientPermissions", validateToken, validadePermission, PermissionController.editUserPermission)

export default clientPermissionRoutes