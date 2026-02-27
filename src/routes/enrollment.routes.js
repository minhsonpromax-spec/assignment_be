import express from 'express'
import { validatorMiddleware } from '../middlewares/validator.middleware.js'
const router = express.Router()
import {
    registerCourseController,
    getEnrollmentRequestsController,
    approveEnrollmentRequestController,
    getStudentListController
} from '../controllers/enrollment.controller.js'
import { 
    registerCourseSchema, 
    getEnrollmentRequestsSchema, 
    approveEnrollmentRequestSchema, 
    getStudentListSchema 
} from '../validators/enrollment.js'
import { can } from '../middlewares/authorization.middleware.js'

router.post(
    "/",
    validatorMiddleware(registerCourseSchema, "body"),
    registerCourseController
)

router.get(
    "/",
    can("CAN_VIEW_REQUESTS"),
    validatorMiddleware(getEnrollmentRequestsSchema, "query"),
    getEnrollmentRequestsController
)

router.get( // người dùng lấy các requests của chính mình
    "/me/enrollment-requests",
    validatorMiddleware(getEnrollmentRequestsSchema, "query"),
    getEnrollmentRequestsController
)

router.patch(
    "/:enrollmentId/approve",
    can("CAN_APPROVE_ENROLLMENT"),
    validatorMiddleware(approveEnrollmentRequestSchema, "params"),
    approveEnrollmentRequestController
)

router.get(
    "/students",
    can("CAN_GET_STUDENT_LIST"),
    validatorMiddleware(getStudentListSchema, "query"),
    getStudentListController
)
// nguyên tắc: Resource (Tài nguyên) + ID + Action (Hành động).