import { AppError } from "../exceptions/app-error.js"
import { verifyToken } from "../services/auth.service.js"

export const Authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader)
      throw new AppError("Unauthorized", 401)

    const token = authHeader.split(" ")[1]

    const decoded = verifyToken(token)

    req.user = decoded
    next()

  } catch (err) {
    next(new AppError("Invalid or expired token", 401))
  }
}
