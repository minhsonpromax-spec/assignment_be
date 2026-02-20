import Joi from "joi"

export const getLessonDetailSchema = {
	params: Joi.object({
		lessonId: Joi.string().uuid().required(),
	}),
}
