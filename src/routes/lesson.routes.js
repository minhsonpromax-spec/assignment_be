import express from 'express'
const router = express.Router()

import { validatormiddleware } from '../middlewares/validator.middleware.js'
import { getLessonDetailSchema } from '../validators/lesson.validator.js'
import { getLessonDetailController } from '../controllers/lesson.controller.js'

router.get(
    "/:lessonId",
    validatormiddleware(getLessonDetailSchema, "params"),
    getLessonDetailController
)

