import { NOTIFICATION_TITLE } from "../constants/notification.js"
import prisma from "../database/index.js"
import { AppError } from "../exceptions/app-error.js"
import { paginate } from "../utils/pagination.js"
import createLogger from "../utils/createLogger.js"

export const registerCourse = async (userId, courseId, context) => {
  const logger = context ? createLogger(context) : null
  const name = await prisma.users.findUnique({where: { id: userId}})

    if (!courseId || !userId) 
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

    if (logger) {
      logger.info("COURSE_REGISTERED", {
        targetType: "UserCourse",
        targetId: userCourse.id,
        metadata: { courseId, userId }
      }).catch(() => {})
    }

    // sendNotification(
    //     NOTIFICATION_TITLE.NEW_COURSE_REGISTRATION,
    //     content,
    //     teacherIds
    // ).catch(console.error)

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


    
export const getEnrollmentRequests = async (filter, page = 1, limit = 10) => {
    const queryArgs = {
      where: filter,
      include: { user: true, course: true },
      orderBy: { registeredAt: "desc" }
    }
    const result = await paginate(prisma.userCourses, queryArgs, page, limit)
    return {
      data: result.data.map(parsePendingRequest),
      meta: result.meta
    }
}

const parsePendingRequest = (item) => ({
  id: item.id,
  userId: item.userId,
  fullName: item.user?.fullName ?? "N/A",
  searchName: item.user?.searchName ?? "",
  userEmail: item.user?.email ?? "N/A",
  courseId: item.courseId,
  courseTitle: item.course?.title ?? "Unknown Course",
  registeredAt: item.registeredAt,
  status: item.status
})

// ========================================== //

export const approveEnrollmentRequest = async (enrollmentId, context) => {
  const logger = context ? createLogger(context) : null

  if( !enrollmentId)
    throw new AppError("EnrollmentId must be provided")

  const enrollment = await prisma.userCourses.findUnique({
    where: { id: enrollmentId }
  })

  if (!enrollment) {
    throw new AppError("Enrollment request not found", 404)
  }

  if (enrollment.status !== "PENDING") {
    throw new AppError("Only pending requests can be approved", 400)
  }

  const updated = await prisma.userCourses.update({
    where: { id: enrollmentId },
    data: {
      status: "APPROVED"
    },
    select: {
      id: true,
      status: true,
      course: {
        select: {
          title: true,
          code: true
        }
      }
    }
  })

  if(logger) {
    logger.info("ENROLLMENT_APPROVED", {
      targetType: "UserCourse",
      targetId: enrollmentId,
      metadata: { courseId: enrollment.courseId, userId: enrollment.userId }
    }).catch(() => {})
  }

  return updated
}


export const getStudentList = async (courseId, page, limit) => {
  if(!courseId)
    throw new AppError("CourseId must be provided")

  const queryArgs = {
    where: {
      status: {
        in: [UserCourseStatus.ENROLLED, UserCourseStatus.COMPLETED]
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
      user: {
        searchName: "asc"
      }
    }
  }
  const result = await paginate(prisma.userCourses, queryArgs, page, limit)
  return result
}