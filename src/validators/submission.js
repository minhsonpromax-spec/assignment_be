import Joi from "joi"

export const getSubmissionForAuthSchema = {
  params: Joi.object({
    submissionId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
}

export const calculateAndSaveScoreSchema = {
  params: Joi.object({
    submissionId: Joi.string().uuid().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
}