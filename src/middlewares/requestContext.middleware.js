export default function requestContext(req, res, next) {
  req.logContext = {
    actorId: req.user?.id || "SYSTEM",
    actorType: req.user?.role || "SYSTEM",
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  }

  next()
}