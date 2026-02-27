import prisma from "../database/index.js"

export const writeLog = async(
  actorId,
  actorType,
  action,
  level = "INFO",
  targetType = null,
  targetId = null,
  metadata = null,
  ipAddress = null,
  userAgent = null,
) => {
    try {
        await prisma.lOG.create({
        data: {
            actorId,
            actorType,
            action,
            level,
            targetType,
            targetId,
            metadata,
            ipAddress,
            userAgent
        }
    })
    } catch (error) {
        console.error("Error writing log:", error)
    }
}