import express from "express"
const router = express.Router({ mergeParams: true })
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

import modelRouter from "./model.routes.js"
import lessonRouter from "./lesson.routes.js"
import assignmentRouter from "./assignment.routes.js"
import enrollmentRouter from "./enrollment.routes.js"
import reviewRouter from "./review.routes.js"

router.use(Authentication) 

router.use('/models', validateCourseIdParams("params"), modelRouter)
router.use('/lessons', validateCourseIdParams("params"), lessonRouter)
router.use('/assignments', validateCourseIdParams("params"), assignmentRouter)
router.use('/enrollments', validateCourseIdParams("params"), enrollmentRouter)
router.use('/reviews', validateCourseIdParams("params"), reviewRouter)


router.get(
    "/", 
    validatorMiddleware(getCourseDetailSchema, "params"),
    getCourseDetailController,
)

router.get( // nên chuyển vị trí này vì nó không liên quan đến courseId cụ thể nào cả
    "/registered/:userId",
    validatorMiddleware(getAllCoursesRegisteredSchema, "query"),
    getAllCoursesRegisteredController
)

export default router