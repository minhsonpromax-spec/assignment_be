// import { sendNotification } from "../services/notification.service.js"
// import { successResponse } from "../utils/response.js"
// import { asyncHandler } from "../utils/async-handler.js"

// export const sendNotificationController = asyncHandler(async (req, res) => {
//   const { title, content, userIds } = req.body
//   const result = await sendNotification(title, content, userIds)
//   return successResponse(res, { 
//     statusCode: 201,
//     message: "Send notification successfully",
//     data: result ?? null})
// })