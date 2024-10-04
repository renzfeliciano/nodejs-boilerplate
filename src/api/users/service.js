import User from "../users/model.js"
import QueryHelperUtils from "../../utils/queryHelper.js"
import JwtUtils from "../../utils/jwt.js"
import AppError from "../../utils/error.js"
import RedisUtils from "../../configs/redis.js"

class UserService {
    list = async (req) => {
        const { page, limit, sortField, sort, ...filters } = req.query
            const options = {
                page,
                limit,
                sortField,
                sort,
            }
            // options.selectFields = '_id name email role'
            // filters.isActive = null
            const result = await QueryHelperUtils.getDocuments(User, filters, options)

            return result
    }
}

export default new UserService()