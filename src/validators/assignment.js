import Joi from "joi"

export const getAllAssignmentDidSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
  params: Joi.object({}),
  body: Joi.object({}),
}

export const getOfficialAssignmentScoreSchema = {
  params: Joi.object({
    assignmentId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
}

export const getAllStudentScoreSchema = {
  params: Joi.object({
    assignmentId: Joi.string().uuid().required(),
  }),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
  body: Joi.object({}),
}