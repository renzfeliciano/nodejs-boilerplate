import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
import AppError from "./error.js"

dotenv.config()

class JwtUtils {
    constructor() {
        this.secretKey = process.env.TOKEN_SECRET ?? 'your token secretKey'
        this.refreshSecretKey = process.env.TOKEN_SECRET ?? 'your refresh token secretKey'
        this.accessExpiresIn = process.env.TOKEN_EXPIRATION ?? '15m'
        this.refreshExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION ?? '7d'
    }

    // Method to generate access and refresh tokens
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, this.secretKey, { expiresIn: this.accessExpiresIn })
        const refreshToken = jwt.sign(payload, this.refreshSecretKey, { expiresIn: this.refreshExpiresIn })
        return { accessToken, refreshToken }
    }

    // Method to verify a JWT
    verifyToken(req, next, token) {
        jwt.verify(token, this.secretKey, (err, user) => {
            if (err) {
                return next(new AppError("AUTHORIZATION_ERROR", 403, "Invalid or expired token."))
            }

            req.user = user // Attach the user info to the request
            next()
        })
    }
}

export default new JwtUtils()
