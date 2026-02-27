export const loadAuthProfile = async (req, res, next) => {
  try {
    const userId = req.user.id

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
        },
        courseRoles: { 
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
        }
      }
    })

    if (!user || !user.isActive) throw new AppError("Unauthorized", 401)


    const systemPermissions = user.userRoles
      .filter(ur => ur.role.scope === 'SYSTEM')
      .flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.permissionCode))
      // làm phẳng, chuyển từ các mảng lồng nhau thành 1 mảng đơn

    const courseAccessMap = {}
    user.courseRoles.forEach(cr => {
      const perms = cr.role.rolePermissions.map(rp => rp.permission.permissionCode)
      courseAccessMap[cr.courseId] = perms
    })

    req.auth = {
      userId: user.id,
      systemPermissions,
      courseAccessMap,
    }

    next()
  } catch (err) {
    next(err)
  }
}

export const can = (permissionCode) => {
  return (req, res, next) => {
    const { systemPermissions, courseAccessMap } = req.auth
    const { courseId } = req.params 


    if (systemPermissions.includes(permissionCode)) {
      return next()
    }


    if (courseId && courseAccessMap[courseId]?.includes(permissionCode)) {
      return next()
    }

    return next(new AppError("Forbidden: Insufficient permissions", 403))
  }
}