import { createClient } from 'redis'

class RedisUtils {
    constructor() {
        this.client = createClient({
            password: process.env.REDIS_PASS ?? 'your_redis_password',
            socket: {
                host: process.env.REDIS_HOST ?? 'your_redis_host',
                port: process.env.REDIS_PORT ?? 'your_redis_port',
            },
        })

        this.client.on('error', (err) => {
            console.error('Redis Client Error', err)
        })
    }

    async connect() {
        try {
            await this.client.connect()
            console.log('Connected to Redis successfully')
        } catch (error) {
            console.error('Error connecting to Redis:', error.message)
            throw new Error('Failed to connect to Redis')
        }
    }

    async disconnect() {
        try {
            await this.client.disconnect()
            console.log('Disconnected from Redis')
        } catch (error) {
            console.error('Error disconnecting from Redis:', error.message)
        }
    }

    async getCache(cacheKey) {
        try {
            return await this.client.get(cacheKey)
        } catch (error) {
            console.error('Error getting cache:', error.message)
            throw new Error('Failed to get cache')
        }
    }

    async setCache(cacheKey, cacheData) {
        try {
            return await this.client.set(cacheKey, cacheData)
        } catch (error) {
            console.error('Error setting cache:', error.message)
            throw new Error('Failed to set cache')
        }
    }

    async deleteCache(cacheKey) {
        try {
            return await this.client.del(cacheKey)
        } catch (error) {
            console.error('Error deleting cache:', error.message)
            throw new Error('Failed to delete cache')
        }
    }
}

const redisUtils = new RedisUtils()
export default redisUtils
