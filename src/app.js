import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import { rateLimit } from 'express-rate-limit'
import ConnectionConfig from "./configs/connection.js"
import MiddlewareUtils from "./utils/middleware.js"
import AuthRoutes from "./api/auth/routes.js"
import UserRoutes from "./api/users/routes.js"

dotenv.config()
const app = express()

// Initialize connection/s
await ConnectionConfig.initialize().catch(err => { console.log(err) })

app.use(MiddlewareUtils.requestIdMiddleware)
app.use(helmet({ contentSecurityPolicy: true }))
app.use(MiddlewareUtils.cors)
// app.use(MiddlewareUtils.limiter)
app.use(rateLimit(MiddlewareUtils.limiter))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Conditional logging middleware only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined')) // Use 'combined' format for detailed logs
}

// Mount routes
app.use('/api/v1/auth', AuthRoutes) // Auth Routes
app.use('/api/v1/users', UserRoutes) // User Routes

// Handle 404 (Not Found)
app.use(MiddlewareUtils.notFound)

// Global error handling middleware
app.use(MiddlewareUtils.errorHandler)

export default app