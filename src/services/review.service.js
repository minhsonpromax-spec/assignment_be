export const updateReviewPoint = async (reviewId, point) => {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { point }
  })

  await submissionService.recalculateFinalScore(review.submissionId)

  return review
}
