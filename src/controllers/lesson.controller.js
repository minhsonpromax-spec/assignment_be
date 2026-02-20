import { getLessonDetail } from "../services/lesson.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const getLessonDetailController = asyncHandler(async (req, res) => {
	const { lessonId } = req.params
	const result = await getLessonDetail(lessonId)
	return successResponse(res, { 
        statusCode: 200,
        message: "Get lesson detail successfully",
        data: result ?? null
    })
})
