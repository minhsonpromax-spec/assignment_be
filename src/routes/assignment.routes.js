

import express from "express"
import {
  getAllAssignmentDidController,
  getOfficialAssignmentScoreController,
  getAllStudentScoreController,
} from "../controllers/assignment.controller.js"
import { validatorMiddleware } from "../middlewares/validator.middleware.js"
import {
  getAllAssignmentDidSchema,
  getOfficialAssignmentScoreSchema,
  getAllStudentScoreSchema,
} from "../validators/assignment.js"
import {Authentication} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.use(Authentication)

router.get(
  "/assignments/did",
  validatorMiddleware(getAllAssignmentDidSchema, "query"),
  getAllAssignmentDidController
)


router.get(
  "/assignments/:assignmentId/score",
  validatorMiddleware(getOfficialAssignmentScoreSchema, "params"),
  getOfficialAssignmentScoreController
)


router.get(
  "/assignments/:assignmentId/students/score",
  validatorMiddleware(getAllStudentScoreSchema, "params"),
  validatorMiddleware(getAllStudentScoreSchema, "query"),
  getAllStudentScoreController
)

export default router
