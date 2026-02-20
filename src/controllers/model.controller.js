import { getModelDetail } from "../services/model.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/async-handler.js"

export const getModelDetailController = asyncHandler(async (req, res) => {
  const { modelId } = req.params
  const result = await getModelDetail(modelId)
  return successResponse(res, { 
    statusCode: 200,
    message: "Get model detail successfully",
    data: result ?? null })
})