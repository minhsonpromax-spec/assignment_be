import { logIn, requestPasswordReset, resetPassword, signUp } from "../services/auth.service.js"
import { successResponse } from "../utils/response.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const signUpController = asyncHandler(async (req, res) => {
    const context = req.logContext
    const result = await signUp(req.body, context)
    
    return successResponse(res, {
        statusCode: 201,
        message: "Signup successful",
        data: result,
    })
})

export const logInController = asyncHandler(async (req, res) => {
    const result = await logIn(req.body)
    return successResponse(res, {
        statusCode: 200,
        message: "Login successful",
        data: result
    })
})

export const requestPasswordResetController = asyncHandler(async (req, res) => {
    const {email} = req.body
    const context = req.logContext
    const message = await requestPasswordReset(email, context)
    return successResponse(res, {
        statusCode: 202,
        message: message
    })
})

export const resetPasswordController = asyncHandler(async (req, res) => {
    const {token, newPassword} = req.body
    const context = req.logContext
    const message = await resetPassword(token, newPassword, context)
    return successResponse(res, {
        statusCode: 200,
        message: message
    })
})