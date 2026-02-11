import { NOTIFICATION_TITLE } from "../constants/notification.js"
import prisma from "../database/index.js"
import { AppError } from "../exceptions/app-error.js"

export const registerCourse = async (user, body) => {
    const { id: userId, name } = user
    const { courseId } = body

    if (!courseId) 
        throw new AppError("courseId is required", 400)
        
    const course = await prisma.Courses.findUnique({
        where: { id: courseId }
    })
    if (!course) 
        throw new AppError("Course not found", 404)
        

    const existed = await prisma.UserCourses.findFirst({
        where: { userId, courseId: courseId }
    })
    if (existed) 
        throw new AppError("User already registered this course", 400)
        

    const userCourse = await prisma.UserCourses.create({
        data: {
            userId,
            courseId: courseId,
            status: UserCourseStatus.ENROLLED
        }
    })

    const teachers = await teachersByCourses(courseId)
    const teacherIds = teachers.map(t => t.userId)

    const content = `New course registration: ${name} has registered for "${course.name}".`

    sendNotification(
        NOTIFICATION_TITLE.NEW_COURSE_REGISTRATION,
        content,
        teacherIds
    ).catch(console.error)

    return userCourse
}


export const teachersByCourses = async (courseId) => {
  return prisma.courseRole.findMany({
    where: {
      courseId: courseId,
      role: {
        name: "TEACHER"
      }
    },
    select: {
      userId: true
    }
  })
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




