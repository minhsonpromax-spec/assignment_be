import { NOTIFICATION_TITLE } from "../constants/notification.js"
import prisma from "../database/index.js"
import { AppError } from "../exceptions/app-error.js"
import {resolveCourseAccess} from "../utils/permission.js"

export const registerCourse = async (user, body) => {
    const { id: userId, name } = user
    const { courseId } = body

    if (!courseId) 
        throw new AppError("courseId is required", 400)
        
    const course = await prisma.courses.findUnique({
        where: { id: courseId }
    })
    if (!course) 
        throw new AppError("Course not found", 404)
        

    const existed = await prisma.userCourses.findFirst({
        where: { userId, courseId: courseId }
    })
    if (existed) 
        throw new AppError("User already registered this course", 400)
        

    const userCourse = await prisma.userCourses.create({
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


    
export const getEnrollmentRequests = async (userId) => {

  const access = await resolveCourseAccess(userId, "CAN_VIEW_REQUESTS")

  if (access.type === "SYSTEM") {
    return prisma.userCourses.findMany({
      where: { status: "PENDING" },
      include: { user: true, course: true },
      orderBy: { registeredAt: "desc" }
    })
  }

  if (access.type === "COURSE") {
    return prisma.userCourses.findMany({
      where: {
        status: "PENDING",
        courseId: { in: access.courseIds }
      },
      include: { user: true, course: true },
      orderBy: { registeredAt: "desc" }
    })
  }

  // student chỉ có thấy request của chính họ
  return prisma.userCourses.findMany({
    where: {
      userId: userId
    },
    include: { course: true },
    orderBy: { registeredAt: "desc" }
  })
}


export const approveEnrollmentRequest = async (currentUserId, enrollmentId) => {
    const enrollment = await prisma.userCourses.findUnique({
    where: { id: enrollmentId }
  })

  if (!enrollment) {
    throw new AppError("Enrollment request not found", 404)
  }

  const targetCourseId = enrollment.courseId

  const access = await resolveCourseAccess(
    currentUserId,
    "CAN_APPROVE_ENROLLMENT",
    targetCourseId
  )

  if (access.type === "NONE") {
    throw new AppError("Forbidden", 403)
  }

  const updated = await prisma.userCourses.update({
    where: { id: enrollmentId },
    data: {
      status: "APPROVED"
    }
  })

  return updated
}


export const getStudentList = async (userId, courseId) => {
  const access = await resolveCourseAccess(userId, 'CAN_GET_STUDENT_LIST', courseId)
  
  if (access.type === "NONE") {
    throw new AppError("Forbidden", 403)
  }

    const studentList = await prisma.userCourses.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'ENROLLED']
        }
      },
      select: {
        user: {
          id: true,
          fullName: true,
          email: true,
          isActive: true
        }
      },
      orderBy: {
          searchName: "asc"
      }
    })
  return studentList
}