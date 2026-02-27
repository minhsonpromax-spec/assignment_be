import express from "express"

import { updateReviewPointController } from "../controllers/review.controller.js"
import { validatorMiddleware } from "../middlewares/validator.middleware.js"
import { updateReviewPointSchema } from "../validators/review.js"
import { can } from "../middlewares/authorization.middleware.js"

const router = express.Router()

router.put(
	"/:submissionId/review",
	can("CAN_MARK_SUBMISSION"),
	validatorMiddleware(updateReviewPointSchema, "params"),
	validatorMiddleware(updateReviewPointSchema, "body"),
	updateReviewPointController
)   

export default router

