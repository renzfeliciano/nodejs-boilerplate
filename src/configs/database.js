import * as mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

class DatabaseConfig {
    constructor() {
        this.mongoUri = process.env.MONGO_URI ?? 'your_mongo_db_resource'
        if (!this.mongoUri) {
            throw new Error("MONGO_URI environment variable is not set")
        }
    }

    async connect() {
        try {
            await mongoose.connect(this.mongoUri, {
                maxPoolSize: 10, // Adjust based on your application needs
            })
            console.log("Connected to MongoDB successfully")
        } catch (error) {
            console.error("Error connecting to MongoDB:", error.message)
            throw new Error("Failed to connect to MongoDB")
        }

        this.handleAppTermination()
    }

    handleAppTermination() {
        process.on("SIGINT", async () => {
            try {
                await mongoose.connection.close()
                console.log("MongoDB connection closed due to app termination")
                process.exit(0)
            } catch (error) {
                console.error("Error closing MongoDB connection:", error.message)
                process.exit(1)
            }
        })
    }
}

const databaseConfig = new DatabaseConfig()
export default databaseConfig