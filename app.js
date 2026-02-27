import express from 'express'
import cors from 'cors'
import coursesRouter from './routers/courses.js'
import usersRouter from './routers/users.js'
import { errorLogger } from './middlewares/errorLogger.middleware.js'
import { catchError } from './middlewares/catchError.middleware.js'

const app = express()

app.use(cors())
app.use(express.json()) //Chuyển JSON body → req.body

app.use('/courses', coursesRouter)
app.use('/users', usersRouter)

app.use(errorLogger)
app.use(catchError)

export default app
