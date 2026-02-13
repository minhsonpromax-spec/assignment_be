export const resolveCourseAccess = async (userId, permissionCode, targetCourseId = null) => {
   // nếu scope là system thì nghĩa là có phạm vi trên toàn hệ thống -> ADMIN
   // nếu scope là course thì nghĩa là có phạm vi trên course -> student hoặc teacher trên course đó 
  // xem input để đỡ nhầm lẫn về student và teacher
   const userAccess = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      userRoles: {
        where: { role: { scope: "SYSTEM" } },
        select: {
          role: {
            select: {
              rolePermissions: {
                select: {
                  permission: {
                    select: { permissionCode: true }
                  }
                }
              }
            }
          }
        }
      },
      courseRoles: {
        where: { 
            role: { 
                scope: "COURSE",
                ...(targetCourseId ? { courseId: targetCourseId } : {})
             }},   
        select: {
          courseId: true,
          role: {
            select: {
              rolePermissions: {
                select: {
                  permission: {
                    select: { permissionCode: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  if (!userAccess) {
    return { type: "NONE", courseIds: [] }
  }

  const hasSystemPermission = userAccess.userRoles.some(ur =>
    ur.role.rolePermissions.some(rp =>
      rp.permission.permissionCode === permissionCode
    )
  )

  if (hasSystemPermission) {
    return { type: "SYSTEM" }
  }

  const allowedCourseIds = userAccess.courseRoles
    .filter(cr =>
      cr.role.rolePermissions.some(rp =>
        rp.permission.permissionCode === permissionCode
      )
    )
    .map(cr => cr.courseId)

  if (allowedCourseIds.length > 0) {
    if (targetCourseId && !allowedCourseIds.includes(targetCourseId)) {
       return { type: "NONE", courseIds: [] }
    }
    return { type: "COURSE", courseIds: allowedCourseIds }
  }

  return { type: "NONE", courseIds: [] }
}
