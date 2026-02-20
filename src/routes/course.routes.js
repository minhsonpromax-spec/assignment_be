import express from "express"
const router = express.Router()
import { 
    getCourseDetailController, 
    getAllCoursesRegisteredController
} from "../controllers/course.controller.js"
import { validatorMiddleware } from "../middlewares/validator.middleware.js"
import {
    getCourseDetailSchema,
    getAllCoursesRegisteredSchema
} from "../validators/course.js"
import {Authentication} from "../middlewares/auth.middleware.js"

router.use(Authentication) 
router.get(
    "/getDetail/:courseId", 
    validatorMiddleware(getCourseDetailSchema, "params"),
    getCourseDetailController,
)

router.get(
    "/registered/:userId",
    validatorMiddleware(getAllCoursesRegisteredSchema, "query"),
    getAllCoursesRegisteredController
)

export default router