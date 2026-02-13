export const loadAuthProfile = async (req, res, next) => {
  try {
    const { userId } = req.user // From your JWT middleware

    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
        },
        courseRoles: { // Load course IDs and permissions upfront to save DB calls later
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } }
        }
      }
    })

    if (!user || !user.isActive) throw new AppError("Unauthorized", 401)

    // Flatten Global Permissions
    const systemPermissions = user.userRoles
      .filter(ur => ur.role.scope === 'SYSTEM')
      .flatMap(ur => ur.role.rolePermissions.map(rp => rp.permission.permissionCode))

    // Map Course Permissions: { courseId: [permissionCodes] }
    const courseAccessMap = {}
    user.courseRoles.forEach(cr => {
      const perms = cr.role.rolePermissions.map(rp => rp.permission.permissionCode)
      courseAccessMap[cr.courseId] = perms
    })

    req.auth = {
      userId: user.id,
      systemPermissions,
      courseAccessMap,
      isSystemAdmin: systemPermissions.includes('ADMIN_POWER') // Optional helper
    }

    next()
  } catch (err) {
    next(err)
  }
}

// Use this for any route (Global or Course-specific)
export const can = (permissionCode) => {
  return (req, res, next) => {
    const { systemPermissions, courseAccessMap } = req.auth
    const { courseId } = req.params // or req.query depending on route

    // 1. Check Global/System Scope first
    if (systemPermissions.includes(permissionCode)) {
      return next()
    }

    // 2. If a course context exists, check Course Scope
    if (courseId && courseAccessMap[courseId]?.includes(permissionCode)) {
      return next()
    }

    return next(new AppError("Forbidden: Insufficient permissions", 403))
  }
}