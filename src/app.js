import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import initializeConnection from "./configs/connection.js"
import middlewareUtils from "./utils/middleware.js"
import authRoutes from "./api/auth/routes.js"

dotenv.config()
const app = express()

// Initialize connection/s
await initializeConnection().catch(err => { console.log(err) })

app.use(middlewareUtils.requestIdMiddleware)
app.use(helmet({ contentSecurityPolicy: true }))
app.use(middlewareUtils.cors)
app.use(middlewareUtils.limiter)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Conditional logging middleware only in development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined')) // Use 'combined' format for detailed logs
}

// Mount routes
app.use('/api/v1/auth', authRoutes) // Auth Routes
// app.use('/api/v1/users', UserRoutes) // User Routes

// Handle 404 (Not Found)
app.use(middlewareUtils.notFound)

// Global error handling middleware
app.use(middlewareUtils.errorHandler)

export default app