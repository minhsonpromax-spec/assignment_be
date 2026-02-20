import { updateReviewPoint } from "../services/review.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const updateReviewPointController = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const { submissionId } = req.params
  const { reviewPoints } = req.body
  const result = await updateReviewPoint(userId, submissionId, reviewPoints)
  return successResponse(res, { 
    statusCode: 200,
    message: "Update review point successfully",
    data: result })
})