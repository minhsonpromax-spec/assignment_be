import createLogger from "../utils/createLogger"

export const errorLogger = (err, req, res, next) => {
    const context = req.logContext || {}
    const logger = createLogger(context)

    logger.error(`Error: ${err.message}`, {
        stack: err.stack,
        code: err.code || "INTERNAL_ERROR",
        statusCode: err.statusCode || 500,
    })
    next(err)
}