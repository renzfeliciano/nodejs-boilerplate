import app from "./app.js"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT ?? 3000
const ENVIRONMENT = process.env.NODE_ENV ?? 'development'

const server = app.listen(PORT, () => {
    console.log(`Server is now running in ${ENVIRONMENT} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`)
    server.close(() => process.exit(1))
})

// Gracefully handle termination signals (SIGTERM, SIGINT)
const gracefulShutdown = (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`)
    server.close(() => {
        console.log("Process terminated.")
    })
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))