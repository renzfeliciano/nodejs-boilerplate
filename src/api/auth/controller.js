import authService from "./service.js"

class AuthController {
    login = async (req, res, next) => {
        console.log('login controller trigger')
        const result = await authService.login()
        return result
    }

    register = (req, res, next) => {

    }

    logout = (req, res, next) => {

    }

    token = (req, res, next) => {

    }

    refreshToken = (req, res, next) => {

    }
}

const authController = new AuthController()
export default authController