import { writeLog } from "../services/log.service"

function createLogger(context) {
  return {
    info(action, options = {}) {
      return writeLog({
        ...context,
        action,
        level: "INFO",
        ...options,
      })
    },

    error(action, options = {}) {
      return writeLog({
        ...context,
        action,
        level: "ERROR",
        ...options,
      })
    },

    warn(action, options = {}) {
      return writeLog({
        ...context,
        action,
        level: "WARN",
        ...options,
      })
    },
  }
}

export default createLogger