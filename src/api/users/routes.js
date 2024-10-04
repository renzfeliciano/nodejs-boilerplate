import express from "express"
import MiddlewareUtils from "../../utils/middleware.js"
import UserController from "./controller.js"
import UserValidation from "./validation.js"
import Handlers from "../../shared/handlers.js"

const router = express.Router()

router.get('', MiddlewareUtils.authenticateToken, MiddlewareUtils.validateRequest(UserValidation.list), Handlers.errorHandler(UserController.list))

export default router