import { getAllAssignmentDid, getOfficialAssignmentScore } from "../services/assignment.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const getAllAssignmentDidController = asyncHandler(async (req, res) => {
  const userId = req.user.id
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const result = await getAllAssignmentDid(userId, page, limit)

  return successResponse(res, {
    statusCode: 200,
    message: "Get all assignment did successfully",
    data: result.data ?? null,
    meta: result.meta
  })
})

export const getOfficialAssignmentScoreController = asyncHandler(async(req, res) => {
  const {assignmentId, courseId} = req.params
  const userId = req.user.id

  const result = await getOfficialAssignmentScore(assignmentId, courseId, userId)
  return successResponse(res, {
    statusCode: 200,
    message: "Get official assignment score successfully",
    data: result ?? null
  })
})

export const getAllStudentScoreController = asyncHandler(async(req, res) => {
  const {assignmentId, courseId} = req.params
  const userId = req.user.id
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const result = await getAllStudentScore(userId, assignmentId, courseId, page, limit)
  return successResponse(res, {
    statusCode: 200,
    message: "Get all student score successfully",
    data: result.data ?? null,
    meta: result.meta
  })
})