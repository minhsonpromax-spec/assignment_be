import express from "express"
import {
  signUpController,
  logInController,
  requestPasswordResetController,
  resetPasswordController,
} from "../controllers/auth.controller.js"
import validatorMiddleware from "../middlewares/validator.middleware.js"
import {
  signUpSchema,
  logInSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../validators/auth.js"

const router = express.Router()


router.post(
  "/signup",
  validatorMiddleware(signUpSchema, "body"),
  signUpController
)

router.post(
  "/login",
  validatorMiddleware(logInSchema, "body"),
  logInController
)

router.post(
  "/request-password-reset",
  validatorMiddleware(requestPasswordResetSchema, "body"),
  requestPasswordResetController
)

router.post(
  "/reset-password",
  validatorMiddleware(resetPasswordSchema, "body"),
  resetPasswordController
)

export default router
