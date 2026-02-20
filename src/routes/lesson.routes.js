import express from 'express'
const router = express.Router()

import { Authentication } from '../middlewares/authentication.middleware.js'
import { validatormiddleware } from '../middlewares/validator.middleware.js'
import { getLessonDetailSchema } from '../validators/lesson.validator.js'
import { getLessonDetailController } from '../controllers/lesson.controller.js'

router.get(
    "/:lessonId",
    Authentication,
    validatormiddleware(getLessonDetailSchema, "params"),
    getLessonDetailController
)

