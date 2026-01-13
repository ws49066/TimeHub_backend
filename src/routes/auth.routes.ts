import { AuthController } from "@/controllers/AuthController";
import { validateLogin } from "@/middlewares/validateLogin";
import { Router } from "express";

const authRoutes = Router()

authRoutes.post('/login', validateLogin, AuthController.login)

export default authRoutes
