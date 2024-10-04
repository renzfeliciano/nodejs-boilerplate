import { v4 as uuidv4 } from "uuid"
import JwtUtils from "./jwt.js"
import RedisClient from "../configs/redis.js"
import AppError from "./error.js"
import CONSTANTS from "../shared/constants.js"

class MiddlewareUtils {
    requestIdMiddleware(req, res, next) {
        req.requestId = uuidv4() // Create a new UUID for the request
        next()
    }

    cors = (req, res, next) => {
        const origin = req.headers.origin

        if (CONSTANTS.ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
            res.setHeader('Access-Control-Allow-Origin', origin || '*')
            res.setHeader('Access-Control-Allow-Methods', CONSTANTS.ALLOWED_METHODS)
            res.setHeader('Access-Control-Allow-Headers', CONSTANTS.ALLOWED_HEADERS)
            res.setHeader('Access-Control-Allow-Credentials', true)
            // Continue to next middleware or route handler
            next()
        } else {
            next(new AppError('FORBIDDEN_ACCESS', 403, 'Access denied.'))
        }
    }

    limiter = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        handler: (req, res, next) => {
            next(new AppError('RATE_LIMIT_EXCEEDED', 429, `Too many requests, please try again later.`))
        },
    }

    notFound(req, res, next) {
        next(new AppError("NOT_FOUND", 404, 'Resource not found.'))
    }

    validateRequest(schema) {
        return (req, res, next) => {
            const result = schema.validate(req.body, { abortEarly: false })
            
            if (result.error) {
                console.log(result.error)
                const hasUnknownFieldErrors = result.error.details.some(detail => detail.type === 'object.unknown')
                if (hasUnknownFieldErrors) {
                    next(new AppError("VALIDATION_ERROR", 400, "Request contains unknown field/s."))
                } else {
                    const firstError = result.error.details[0]
                    next(new AppError("VALIDATION_ERROR", 400, firstError.message))
                }
            } else {
                if (!req.value) {
                    req.value = {}
                }
                req.value['body'] = result.value
                next()
            }
        }
    }

    authenticateToken = async (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        
        if (!token) {
            return next(new AppError("AUTHENTICATION_ERROR", 401, "Authorization token is missing or invalid."))
        }

        // Check if the token is blacklisted
        const isBlacklisted = await RedisClient.getCache(`blacklist:${token}`)
        if (isBlacklisted) {
            return next(new AppError("AUTHORIZATION_ERROR", 403, "Token has been invalidated. Please login."))
        }
    
        return JwtUtils.verifyToken(req, next, token)
    }

    errorHandler = (err, req, res, next) => {
        const statusCode = err?.status || 500
        res.status(statusCode).json({
            success: false,
            data: {
                error: {
                    code: err?.code,
                    message: err?.message,
                    type: err?.type,
                    status: statusCode,
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                },
            },
            meta: {
                version: '1.0',
            },
            // Optionally include stack trace in development environment for debugging
            // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        })
    }
}

export default new MiddlewareUtils()
