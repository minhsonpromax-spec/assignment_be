import Joi from "joi"

export const getCourseDetailSchema = {
    params: Joi.object({
        courseId: Joi.string().uuid().required(),
    }),
    query: Joi.object({}),
    body: Joi.object({}),
}

export const getAllCoursesRegisteredSchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    }),
    params: Joi.object({}),
    body: Joi.object({}),
}

export const validateCourseIdParams = Joi.object({
    params: Joi.object({
        courseId: Joi.string().uuid().required(),
    }),
    query: Joi.object({}),
    body: Joi.object({}),
})