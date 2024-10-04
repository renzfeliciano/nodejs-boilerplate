import User from "../users/model.js"
import QueryHelperUtils from "../../utils/queryHelper.js"
import JwtUtils from "../../utils/jwt.js"
import AppError from "../../utils/error.js"
import RedisUtils from "../../configs/redis.js"

class AuthService {
    login = async (req) => {
        const { email, password } = req.body
        const user = await QueryHelperUtils.getDocument(User, { email: email })
        const isPasswordMatch = user && await user.verifyPassword(password)

        if (!user || !isPasswordMatch) {
            throw new AppError('INVALID_CREDENTIALS', 401, 'Please check your email and password and try again.')
        }

        // Invalidate old refresh token
        await RedisUtils.getAndDeleteCache(`refreshToken:${user._id.toString()}`)

        const result = JwtUtils.generateTokens({
            _id: user._id,
            email: user.email
        })
        
        // Save new refresh token w/ expiration
        await RedisUtils.setExCache(`refreshToken:${user._id.toString()}`, result.refreshToken)

        return {
            message: "You've successfully logged in.",
            ...result
        }
    }

    register = async (req) => {
        const { email } = req.body
        const existingUser = await QueryHelperUtils.getDocument(User, { email })

        if (existingUser) {
            throw new AppError('EMAIL_ALREADY_EXISTS', 409, 'Email already exists. Please sign in.')
        }

        const user = await QueryHelperUtils.createDocument(User, req.body)

        const result = JwtUtils.generateTokens({
            _id: user._id,
            email: user.email
        })
        
        await RedisUtils.setExCache(`refreshToken:${user._id.toString()}`, result.refreshToken)

        return {
            message: "You've successfully registered.",
            ...result
        }
    }

    logout = async (req) => {
        if (!req.user) {
            throw new AppError('AUTHENTICATION_ERROR, 401, Not authenticated.')
        }
        
        const token = req.headers['authorization'].split(' ')[1]
        await RedisUtils.setExCache(`blacklist:${token}`, 'true')
        await RedisUtils.deleteCache(`refreshToken:${req.user._id.toString()}`)
        req.user = null

        return { 
            message: "You've been logged out." 
        }
    }
}

export default new AuthService()