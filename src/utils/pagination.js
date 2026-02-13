// gpt gợi ý phần này hay

/**
 * Utility function to paginate Prisma queries
 * @param {object} model - The Prisma model (e.g., prisma.userCourses)
 * @param {object} args - Standard Prisma findMany arguments (where, include, select, etc.)
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
*/


export const paginate = async (model, args = {}, page = 1, limit = 10) => {
  const take = Number(limit) || 10
  const skip = (Number(page) - 1) * take

  // Chạy song song: 1 cái đếm tổng số lượng, 1 cái lấy dữ liệu trang hiện tại
  const [totalItems, data] = await Promise.all([
    model.count({ where: args.where }),
    model.findMany({
      ...args,
      take,
      skip,
    }),
  ])

  const totalPages = Math.ceil(totalItems / take)

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: Number(page),
      limit: take,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}