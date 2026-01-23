import { PermissionController } from '@/controllers/PermissionController'
import { validadePermission } from '@/middlewares/validadePermissions'
import { validadeUserAdmin } from '@/middlewares/validateAdmin'
import { validateToken } from '@/middlewares/validateAuth'
import { Router } from 'express'


const clientPermissionRoutes = Router()

clientPermissionRoutes.get("/clients", validateToken, validadeUserAdmin, PermissionController.getUserPermission)

clientPermissionRoutes.put("/editClientPermissions", validateToken, validadeUserAdmin, validadePermission, PermissionController.editUserPermission)

export default clientPermissionRoutes