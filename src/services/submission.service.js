import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"

export const getSubmissionForAuth = async (submissionId) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  })
  if (!submission) throw new AppError("Submission not found", 404)
  return submission
}

// gọi khi teacher nhập điểm
export const calculateAndSaveScore = async (tx, submissionId) => {
  const submission = await tx.submission.findUnique({
    where: { id: submissionId },
    include: { reviews: { include: { rubric: true } } }
  })

  let totalScore = 0
  submission.reviews.forEach(review => {
    const point = review.point || 0
    const max = review.rubric.maxPointEach || 10
    const weight = review.rubric.weight || 0
    totalScore += (point / max) * weight
  })

  return await tx.submission.update({
    where: { id: submissionId },
    data: {
      finalScore: parseFloat(totalScore.toFixed(2)),
      status: "GRADED"
    }
  })
}

