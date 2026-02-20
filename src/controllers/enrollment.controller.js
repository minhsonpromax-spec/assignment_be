import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { registerCourse, getEnrollmentRequests, approveEnrollmentRequest } from "../services/enrollment.service.js"

export const registerCourseController = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const {courseId} = req.body
    const result = await registerCourse(userId, courseId)
    return successResponse(res, {
        statusCode: 201,
        message: "Register course successfully",
        data: result
    })
})

export const getEnrollmentRequestsController = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const result = await getEnrollmentRequests(userId, page, limit)
    return successResponse(res, {
        statusCode: 200,
        message: "Get enrollment requests successfully",
        data: result.data ?? null,
        meta: result.meta
    })
})

export const approveEnrollmentRequestController = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const {enrollmentId} = req.params
    const result = await approveEnrollmentRequest(userId, enrollmentId)
    return successResponse(res, {
        statusCode: 201,
        message: "Approve enrollment request successfully",
        data: result.data ?? null
    })
})

export const getStudentListController = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const {courseId} = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const result = await getStudentList(userId, courseId, page, limit)
    return successResponse(res, {
        statusCode: 200,
        message: "Get student list successfully",
        data: result.data ?? null,
        meta: result.meta
    })
})