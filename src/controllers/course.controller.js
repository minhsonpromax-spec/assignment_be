import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { getCourseDetail, getAllCoursesRegistered } from "../services/course.service.js"

export const getCourseDetailController = asyncHandler(async(req, res) => {
    const {courseId} = req.params
    const result = await getCourseDetail(courseId)
    return successResponse(res, {
        statusCode: 200,
        message: "Get course detail successfully",
        data: result
    })
})

export const getAllCoursesRegisteredController = asyncHandler(async (req, res) => {
    const userId = req.user.id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const result = await getAllCoursesRegistered(userId, page, limit)
    return successResponse(res, {
        statusCode: 200,
        message: "Get all courses registered successfully",
        data: result.data ?? null,
        meta: result.meta
    })
})