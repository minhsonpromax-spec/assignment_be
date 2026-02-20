import express from "express"

import { updateReviewPointController } from "../controllers/review.controller.js"
import { validatorMiddleware } from "../middlewares/validator.middleware.js"
import { updateReviewPointSchema } from "../validators/review.js"
import { Authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.use(Authentication)

router.put(
	"/:submissionId/review",
	validatorMiddleware(updateReviewPointSchema, "params"),
	validatorMiddleware(updateReviewPointSchema, "body"),
	updateReviewPointController
)   

export default router

