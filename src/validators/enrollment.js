import Joi from "joi"

export const registerCourseSchema = {
    body: Joi.object({
        courseId: Joi.string().uuid().required(),
    }),
    params: Joi.object({}),
    query: Joi.object({}),
}

export const getEnrollmentRequestsSchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    }),
    params: Joi.object({}),
    body: Joi.object({}),
}

export const approveEnrollmentRequestSchema = {
    params: Joi.object({
        enrollmentId: Joi.string().uuid().required(),
    }),
    body: Joi.object({}),
    query: Joi.object({}),
}

export const getStudentListSchema = {
    body: Joi.object({}),
    params: Joi.object({}),
    query: Joi.object({
        courseId: Joi.string().uuid().required(),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
    }),
}