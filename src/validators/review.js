import Joi from "joi"

export const updateReviewPointSchema = {
  params: Joi.object({
    submissionId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    reviewPoints: Joi.array().items(
      Joi.object({
        rubricId: Joi.string().uuid().required(),
        point: Joi.number().required(),
      })
    ).min(1).required(),
  }),
  query: Joi.object({}),
}