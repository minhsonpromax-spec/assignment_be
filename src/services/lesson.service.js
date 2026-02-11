import { AppError } from "../exceptions/app-error.js"
import prisma from "../database/index.js"

export const getLessonDetail = async (lessonId) => {
    if(!lessonId)
        throw new AppError("lessonId must be provided", 400)

    const lesson = await prisma.lesson.findUnique({
        where: {id: lessonId},
        include: {
            lessonResources: {
                include: {
                    file: {
                        select: {
                            id: true,
                            fileName: true,
                            path: true,
                            fileByte: true
                        }
                }
                }
            },
            assignments: true
        }
    })

    if(!lesson)
        throw new AppError("Lesson not found", 404)
    return parseLessonDetailResponse(lesson)
}

const parseLessonDetailResponse = (lesson) => {
    return {
        id: lesson.id,
        title: lesson.title,
        index: lesson.index,
        content: lesson.content,
        createdAt: lesson.createdAt,

        lessonResources: lesson.lessonResources?.map(parseLessonResourceResponse) || [], // array -> map
        assignments: lesson.assignments?.map(parseAssignmentsResponse)  || []
    }
}

const parseLessonResourceResponse = (lessonResource) => {
    return {
        id: lessonResource.id,
        title: lessonResource.title,
        content: lessonResource.content,
        type: lessonResource.type,
        createdAt: lessonResource.createdAt,

        url: lessonResource.url || null,

        file: lessonResource.file
            ? {
                id: lessonResource.file.id,
                name: lessonResource.file.fileName,
                url: lessonResource.file.path,
                size: lessonResource.file.fileByte
            }
            : null
    }
}

const parseAssignmentsResponse = (assignment) => {
    return {
        id: assignment.id,
        title: assignment.title,
        maxScore: assignment.maxScore,
        allowLate: assignment.allowLate,
        dueDate: assignment.dueDate,
    }
}