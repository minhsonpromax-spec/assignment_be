import Joi from "joi"

export const getModelDetailSchema = {
  params: Joi.object({
    modelId: Joi.string().required(),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
}