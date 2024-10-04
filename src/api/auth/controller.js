import AuthService from "./service.js"

class AuthController {
    login = async (req, res) => {
        const result = await AuthService.login(req)
        res.status(200).json(result)
    }

    register = async (req, res) => {
        const result = await AuthService.register(req)
        res.status(200).json(result)
    }

    logout = async (req, res) => {
        const result = await AuthService.logout(req)
        res.status(200).json(result)
    }
}

export default new AuthController()