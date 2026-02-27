import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"
import { paginate } from "../utils/pagination.js"

export const getAllAssignmentDid = async (userId, page = 1, limit = 10) => {
  if(!userId)
    throw new AppError ("UserId must be provided", 400)

    const queryArgs = {
        where: {userId},
        distinct: ['assignmentId'],
        include: {assignment: true}
    }

    const result = await paginate(prisma.submission, queryArgs, page, limit)

    return {
      data: parseAssignmentDid(result.data),
      meta: result.meta
    }
}

const parseAssignmentDid = (submissions) => {
  return submissions.map(item => ({
    id: item.assignment.id,
    title: item.assignment.title,
    submittedAt: item.submittedAt
  }))
}

//Tại sao cần đưa courseId vào Service dù đã có userId? 
// Để đảm bảo User không thể lấy điểm của một bài tập thuộc về 
// một Khóa học mà họ chưa đăng ký hoặc không có quyền xem (vd học sinh đã bị ban khỏi khóa học)

export const getOfficialAssignmentScore = async (assignmentId, courseId, userId) => {
  if(!userId || !assignmentId || !courseId)
    throw new AppError ("UserId, assignmentId or courseId must be provided", 400)

  const submission = await prisma.submission.findFirst({
    where: {
      assignmentId,
      userId,
      status: "GRADED",
      assignment: {
        courseId: courseId // đảm bảo bài tập này thuộc về khóa học mà user đang yêu cầu
      }
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

// phần file này chờ
export const createAssignment = async (userId, ) => {

}

export const getAllStudentScore = async (assignmentId, courseId, page = 1, limit = 10) => {
  if( !assignmentId || !courseId)
    throw new AppError ("UserId, assignmentId or courseId must be provided", 400)

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