import express from "express"
import MiddlewareUtils from "../../utils/middleware.js"
import AuthValidation from "./validation.js"
import AuthController from "./controller.js"
import Handlers from "../../shared/handlers.js"

const router = express.Router()

router.post('/login', MiddlewareUtils.validateRequest(AuthValidation.login), Handlers.errorHandler(AuthController.login))
router.post('/register', MiddlewareUtils.validateRequest(AuthValidation.register), Handlers.errorHandler(AuthController.register))
router.post('/logout', MiddlewareUtils.authenticateToken, Handlers.errorHandler(AuthController.logout))

export default router