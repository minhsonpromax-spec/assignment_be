export const catchError = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message,
    code: err.code || "INTERNAL_ERROR"
  })
}
