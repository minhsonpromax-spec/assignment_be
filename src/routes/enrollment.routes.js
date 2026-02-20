import express from 'express'
import { validatorMiddleware } from '../middlewares/validator.middleware.js'
const router = express.Router()
import {
    registerCourseController,
    getEnrollmentRequestsController,
    approveEnrollmentRequestController,
    getStudentListController
} from '../controllers/enrollment.controller.js'
import { Authentication } from '../middlewares/auth.middleware.js'
import { 
    registerCourseSchema, 
    getEnrollmentRequestsSchema, 
    approveEnrollmentRequestSchema, 
    getStudentListSchema 
} from '../validators/enrollment.js'

router.use(Authentication)

router.post(
    "/",
    validatorMiddleware(registerCourseSchema, "body"),
    registerCourseController
)

router.get(
    "/",
    validatorMiddleware(getEnrollmentRequestsSchema, "query"),
    getEnrollmentRequestsController
)

router.patch(
    "/:enrollmentId/approve",
    validatorMiddleware(approveEnrollmentRequestSchema, "params"),
    approveEnrollmentRequestController
)

router.get(
    "/students",
    validatorMiddleware(getStudentListSchema, "query"),
    getStudentListController
)
// nguyên tắc: Resource (Tài nguyên) + ID + Action (Hành động).