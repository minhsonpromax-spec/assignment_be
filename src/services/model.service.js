import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"

export const getModelDetail = async (modelId) => {
    if(!modelId) throw new AppError("modelId must be provided", 400)
    const model = await prisma.model.findUnique({
        where: { id: modelId },
        include: {
            lessons: true
        }
    })

    if (!model) 
        throw new AppError("Model not found", 404)

    return parseModelDetailResponse(model)
}


const parseModelDetailResponse = (model) => {
    return {
        id: model.id,
        title: model.title,
        visibility: model.visibility,
        description: model.description,
        createdAt: model.createdAt,
        createdBy: model.createdBy,

        lessons: model.lessons?.map(parseLessonResponse) || [] // array -> map
    }
}

const parseLessonResponse = (lesson) => {
    return {
        id: lesson.id,
        title: lesson.title,
        index: lesson.index,
        content: lesson.content,
        createdAt: lesson.createdAt
    }
}
