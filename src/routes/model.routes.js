import express from 'express'
const router = express.Router()

import { Authentication } from '../middlewares/authentication.middleware.js'
import { validatormiddleware } from '../middlewares/validator.middleware.js'
import { getModelDetailSchema } from '../validators/model.js'
import { getModelDetailController } from '../controllers/model.controller.js'

router.get(
    "/:modelId",
    Authentication,
    validatormiddleware(getModelDetailSchema, "params"),
    getModelDetailController
)

