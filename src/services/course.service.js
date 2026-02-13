import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"

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


export const getAllCoursesRegistered = async (user) => {
    const userCourses = await prisma.userCourses.findMany({
        where: {
            userId: user.id
        },
        include: {
            course: true
        }
    })
    return parseAllCoursesRegistered(userCourses)
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