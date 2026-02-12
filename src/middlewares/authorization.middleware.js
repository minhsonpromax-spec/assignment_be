export const loadUserPermissions = async (req, res, next) => {
  try {
    const { userId } = req.user

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user || !user.isActive)
      throw new AppError("Unauthorized", 401)

    const permissions = user.userRoles.flatMap(ur =>
      ur.role.rolePermissions.map(rp => rp.permission.permissionCode)
    )

    req.auth = {
      userId: user.id,
      permissions
    }

    next()

  } catch (err) {
    next(new AppError("Invalid or expired token", 401))
  }
}


export const requirePermission = (permissionCode) => {
  return (req, res, next) => {
    if (!req.auth.permissions.includes(permissionCode)) {
      return next(new AppError("Forbidden", 403))
    }
    next()
  }
}


export const requireCoursePermission = (permissionCode) => {
  return async (req, res, next) => {
    const { userId } = req.auth
    const { courseId } = req.params

    const courseRole = await prisma.courseRole.findFirst({
      where: {
        userId,
        courseId
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: { permission: true }
            }
          }
        }
      }
    })

    if (!courseRole)
      return next(new AppError("Forbidden", 403))

    const permissions = courseRole.role.rolePermissions.map(
      rp => rp.permission.permissionCode
    )

    if (!permissions.includes(permissionCode))
      return next(new AppError("Forbidden", 403))

    next()
  }
}
