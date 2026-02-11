import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"

export const getAllAssignmentDid = async (userId) => {
    if(!userId)
        throw new AppError ("userId must be provided", 400)
    const assignments = await prisma.submission.findMany({
        where: {userId},
        distinct: ['assignmentId'],
        include: {assignment: true}
    })
    if(!assignments)
        throw new AppError(`user ${userId} did not do any assignments`)
    return parseAssignmentDid(assignments)
}

const parseAssignmentDid = (assignments) => {
    return {
        total: assignments.length,
        data: assignments.map(item => ({
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
