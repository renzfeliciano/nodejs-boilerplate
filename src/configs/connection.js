import databaseConfig from './database.js'
import RedisUtils from './redis.js'

class ConnectionConfig {
    initialize = async () => {
        try {
            // Connect to MongoDB
            await databaseConfig.connect()
    
            // Connect to Redis client
            await RedisUtils.connect()
        } catch (err) {
            console.error('Error initializing connections:', err)
        }
    }
}

export default new ConnectionConfig()