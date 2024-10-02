import databaseConfig from './database.js'
import redisUtils from '../utils/redis.js'

async function initializeConnection() {
    try {
        // Connect to MongoDB
        await databaseConfig.connect()

        // Connect to Redis client
        await redisUtils.connect()
    } catch (err) {
        console.error('Error initializing connections:', err)
    }
}

export default initializeConnection