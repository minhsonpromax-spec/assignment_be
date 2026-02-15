import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"
import { paginate } from "../utils/pagination.js"

// mỗi course có không quá nhiều model đâu, do còn chia nhỏ thành lesson nữa mà,
// nên không cần pagination ở đây cho phức tạp, vì ở đây cần findUnique chứ không phải findMany
export const getCourseDetail = async (courseId) => {
    if(!courseId) throw new AppError("courseId must be provided", 400)
    const course = await prisma.courses.findUnique({
        where: { id: courseId },
        include: {
            models: true
        }
    })

    if (!course) 
        throw new AppError("Course not found", 404)

    return parseCourseDetailResponse(course)
}


export const getAllCoursesRegistered = async (userId, page = 1, limit = 10) => {
    const queryArgs = {
        where: {userId},
        include: {
            course: true
        }
    }

    const result = await paginate(prisma.userCourses, queryArgs, page, limit)

    return {
        data: parseAllCoursesRegistered(result.data),
        meta: result.meta   
    }
}
    
const parseCourseDetailResponse = (course) => {
    return {
        id: course.id,
        code: course.code,
        title: course.title,
        visibility: course.visibility,
        description: course.description,
        createdAt: course.createdAt,
        createdBy: course.createdBy,

        models: course.models?.map(parseModelResponse) || []
    }
}

const parseModelResponse = (model) => {
    return {
        id: model.id,
        title: model.title,
        visibility: model.visibility,
        description: model.description,
        createdAt: model.createdAt
    }
}

const parseAllCoursesRegistered = (userCourses) => {
    return userCourses.map((userCourse) => {
        return {
            id: userCourse.id,
            userId: userCourse.userId,
            courseId: userCourse.courseId,
            courseTitle: userCourse.course.title,
            status: userCourse.status,
            visibility: userCourse.visibility,
            enrolledAt: userCourse.createdAt,
        }
    })
}