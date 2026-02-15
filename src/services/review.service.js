import { prisma } from "../database"
import { AppError } from "../utils/AppError"
import { resolveCourseAccess } from "../utils/permission"
import * as SubmissionService from "./submission.service"

export const updateReviewPoint = async (userId, submissionId, reviewPoints) => {
  const submissionAuth = await SubmissionService.getSubmissionForAuth(submissionId)
  const courseId = submissionAuth.assignment?.lesson?.courseId

  const access = await resolveCourseAccess(userId, 'CAN_MARK_SUBMISSION', courseId)
  if (access.type !== "COURSE") 
    throw new AppError("Forbidden", 403)

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
    return updatedSubmission
  })
}