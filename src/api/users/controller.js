import UserService from "./service.js"

class UserController {
    list = async (req, res) => {
        const result = await UserService.list(req)
        res.status(200).json(result)
    }
}

export default new UserController()