import app from "./app.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
import RedisUtils from "./configs/redis.js"

dotenv.config()

const PORT = process.env.PORT ?? 3000
const ENVIRONMENT = process.env.NODE_ENV ?? 'development'

const server = app.listen(PORT, () => {
    console.log(`Server is now running in ${ENVIRONMENT} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", async (err) => {
    console.error(`Unhandled Rejection: ${err.message}`)
    await mongoose.connection.close()
    await RedisUtils.disconnect()
    server.close(() => process.exit(1))
})

// Gracefully handle termination signals (SIGTERM, SIGINT)
const gracefulShutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`)
    await mongoose.connection.close()
    await RedisUtils.disconnect()
    server.close(() => {
        console.log("Process terminated.")
    })
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))
process.on("SIGINT", () => gracefulShutdown("SIGINT"))