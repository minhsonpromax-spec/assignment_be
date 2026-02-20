
import Joi from "joi"


export const signUpSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        fullName: Joi.string().min(2).required()
    }),
    params: Joi.object({}),
    query: Joi.object({})
}

export const logInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
}

export const requestPasswordResetSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
}

export const resetPasswordSchema = {
    body: Joi.object({
        token: Joi.string().min(20).required(),
        newPassword: Joi.string().min(8).max(100)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
            .required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
}
