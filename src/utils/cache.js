import NodeCache from 'node-cache'

class CacheUtils {
    constructor(ttlSeconds = 60, checkPeriodSeconds = 60) {
        this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: checkPeriodSeconds })
    }

    getCache(cacheKey) {
        return this.cache.get(cacheKey)
    }

    setCache(cacheKey, cacheData) {
        return this.cache.set(cacheKey, cacheData)
    }

    deleteCache(cacheKey) {
        return this.cache.del(cacheKey)
    }
}

export default new CacheUtils()
