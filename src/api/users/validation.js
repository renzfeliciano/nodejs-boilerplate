import Joi from "joi"

class UserValidation {
    list = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        sortField: Joi.string().valid('name.last', 'email').default('name'),
        sort: Joi.string().valid('asc', 'desc').default('asc')
    }).unknown(true)
}

export default new UserValidation()