import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"
import { resolveCourseAccess } from "../utils/permission.js"
import { paginate } from "../utils/pagination.js"

export const getAllAssignmentDid = async (userId, page, limit) => {
    if(!userId)
        throw new AppError ("userId must be provided", 400)

    const queryArgs = {
        where: {userId},
        distinct: ['assignmentId'],
        include: {assignment: true}
    }

    const result = await paginate(prisma.submission, queryArgs, page, limit)

    return parseAssignmentDid(result)
}

const parseAssignmentDid = (result) => {
    return {
        total: result.length,
        data: result.map(item => ({
            id: item.assignment.id,
            title: item.assignment.title,
            submittedAt: item.submittedAt
        }))
    }
}

export const getOfficialAssignmentScore = async (assignmentId, userId) => {
  const submission = await prisma.submission.findFirst({
    where: {
      assignmentId,
      userId,
      status: "GRADED"
    },
    orderBy: {
      finalScore: "desc"
    },
    select: {
      id: true,
      finalScore: true,
      attemptNumber: true,
      gradedAt: true
    }
  })

  return submission
}

export const createAssignment = async (userId, ) => {

}

export const getAllStudentScore = async (userId, assignmentId, page, limit) => {
  const courseId = await prisma.assignment.findUnique({
    where: {id: assignmentId},
    select: {
      lesson: {
        select: {
          model: {
            select: {
              courseId: true
            }
          }
        }
      }
    }
  })

  if(!courseId)
    throw new AppError("Course id not found", 404)

  const access = await resolveCourseAccess(userId, "CAN_GET_STUDENT_SCORE", courseId)

  if (access.type === "NONE") {
    throw new AppError("Forbidden", 403)
  }

  // định nghĩa cấu trúc query để đưa vào hàm phân trang
  const queryArgs = {
    where: { courseId: courseId },
    select: {
      userId: true,
      user: { select: { fullName: true, email: true } },
      submissions: {
        where: { assignmentId: assignmentId },
        orderBy: { finalScore: 'desc' },
        take: 1
      }
    }
  }

  const result = await paginate(prisma.userCourses, queryArgs, page, limit)

  result.data = result.data.map(item => ({
    studentId: item.userId,
    fullName: item.user.fullName,
    email: item.user.email,
    score: item.submissions[0]?.finalScore ?? 0,
    status: item.submissions[0]?.status ?? "NOT_SUBMITTED"
  }))

  return result
}