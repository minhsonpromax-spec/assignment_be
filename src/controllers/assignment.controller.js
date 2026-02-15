import { getAllAssignmentDid } from "../services/assignment.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const getAllAssignmentDidController = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const result = await getAllAssignmentDid(userId, page, limit)

  return successResponse(res, {
    data: result.data,
    meta: result.meta
  })
})

export const getOfficialAssignmentScoreController = asyncHandler(async (req, res) => {
    const {assignmentId} = req.params
})