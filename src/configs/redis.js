import { createClient } from 'redis'

const REDIS_CACHE_VALIDITY = Number(eval(process.env.SEVEN_DAYS_IN_SECONDS))
let client = null
let clients = []

class RedisUtils {
    constructor() {
        if (!client) {
            client = createClient({
                password: process.env.REDIS_PASS ?? 'your_redis_password',
                socket: {
                    host: process.env.REDIS_HOST ?? 'your_redis_host',
                    port: process.env.REDIS_PORT ?? 'your_redis_port',
                },
            })

            client.on('error', (err) => {
                console.error('Redis Client Error', err)
            })

            this.client = client
        } else {
            this.client = client
        }
    }

    async connect() {
        if (this.client.status !== 'ready') { // Check if client is not connected
            try {
                await this.client.connect()
                console.log('Connected to Redis successfully')
            } catch (error) {
                if (error.message.includes('ECONNREFUSED')) {
                    console.error('Redis connection refused')
                } else {
                    console.error('Error connecting to Redis:', error.message)
                    throw new Error('Failed to connect to Redis')
                }
            }
        } else {
            console.log('Redis client already connected')
        }
    }

    async disconnect() {
        for (const client of clients) {
            try {
                await client.disconnect()
                console.log('Disconnected from Redis')
            } catch (error) {
                console.error('Error disconnecting from Redis:', error.message)
            }
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
    async setExCache(cacheKey, cacheData) {
        try {
            return await this.client.setEx(cacheKey, REDIS_CACHE_VALIDITY, cacheData)
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

    async getAndDeleteCache(cacheKey) {
        try {
            const cache = await this.client.get(cacheKey)

            if (cache) {
                return await this.client.del(cache)
            }
            
        } catch (error) {
            console.error('Error deleting cache:', error.message)
            throw new Error('Failed to delete cache')
        }
    }
}

export default new RedisUtils()
