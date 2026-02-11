// gọi khi teacher nhập điểm
export const updateSubmissionScore = async (submissionId) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      reviews: {
        include: { rubric: true }
      }
    }
  })

  let total = 0

  submission.reviews.forEach(review => {
    const { point } = review
    const { maxPointEach, weight } = review.rubric

    if (!maxPointEach || !weight) return

    total += (point / maxPointEach) * weight
  })

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      finalScore: total,
      status: "GRADED"
    }
  })
}
