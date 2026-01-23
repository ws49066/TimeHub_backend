import { AuthController } from "@/controllers/AuthController";
import { validateLogin, validateToken } from "@/middlewares/validateAuth";
import { Router } from "express";

const authRoutes = Router()

authRoutes.post('/login', validateLogin, AuthController.login)
authRoutes.post('/logout', validateToken, AuthController.logout)

export default authRoutes
