import { prisma } from "../database"
import { AppError } from "../utils/AppError"
import { resolveCourseAccess } from "../utils/permission"
import * as SubmissionService from "./submission.service"

export const updateReviewPoint = async (courseId, submissionId, reviewPoints, context) => {
  const logger = context ? createLogger(context) : null
  const submissionAuth = await SubmissionService.getSubmissionForAuth(submissionId)

  return await prisma.$transaction(async (tx) => {

    for (const item of reviewPoints) {
      if (!item.rubricId || typeof item.point !== "number")
        throw new AppError("RubricId and point (number) are required", 400)

      await tx.review.upsert({
        where: {
          rubricId_submissionId: {
            rubricId: item.rubricId,
            submissionId: submissionId
          }
        },
        update: { point: item.point, reviewerId: userId },
        create: {
          rubricId: item.rubricId,
          submissionId: submissionId,
          point: item.point,
          reviewerId: userId
        }
      })
    }

    const updatedSubmission = await SubmissionService.calculateAndSaveScore(tx, submissionId)

    if (logger) {
      await logger.info("Updated review points", {
        submissionId,
        reviewerId: userId
      }).catch(() => {})
    }

    return updatedSubmission
  })
}