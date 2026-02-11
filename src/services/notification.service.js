import prisma from "../database/index.js";

export const sendNotification = async (
    title,
    content,
    userIds
) => {
    const notification = await prisma.notification.create({
        data: {
            title,
            content,
        }
    });
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        }
    });
    const userIdsByDb = users.map((user) => user.id);
    if (userIdsByDb.length != userIds) {
        throw new Error ('aabc!!!')
    }
    const notificationUsers = userIds.map((userId) => {
        return {
            notificationId: notification.id,
            userId,
        }
    });

    await prisma.notificationUser.createMany({
        data: notificationUsers
    });

    return notification;
}