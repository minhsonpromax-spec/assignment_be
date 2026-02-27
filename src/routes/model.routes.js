import express from 'express'
const router = express.Router()

import { validatormiddleware } from '../middlewares/validator.middleware.js'
import { getModelDetailSchema } from '../validators/model.js'
import { getModelDetailController } from '../controllers/model.controller.js'

router.get(
    "/:modelId",
    validatormiddleware(getModelDetailSchema, "params"),
    getModelDetailController
)

