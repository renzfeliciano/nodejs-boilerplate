import express from "express"
import authController from "./controller.js"

const router = express.Router()

router.post('/login', authController.login)
// router.post('/register', MIDDLEWARES.validateRequest(Joi.object(AuthMiddleware.registerSchema)), AuthController.register)
// router.post('/login', MIDDLEWARES.validateRequest(Joi.object(AuthMiddleware.loginSchema)), AuthController.login)
// router.post('/logout', MIDDLEWARES.validateRequest(Joi.object(AuthMiddleware.logoutSchema)), AuthController.logout)
// router.post('/token', AuthController.token)
// router.post('/refreshToken', AuthController.refreshToken)

export default router