import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, AuthRequest } from "../middleware/auth";
import { sendMessageSchema } from "../lib/validations";

export const messageRouter = Router();

// GET CONVERSATIONS
messageRouter.get(
    "/conversations",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const userId = req.user!.id;

            // Get unique conversation partners
            const sentMessages = await prisma.message.findMany({
                where: { senderId: userId, deletedAt: null },
                select: { receiverId: true },
                distinct: ["receiverId"],
            });

            const receivedMessages = await prisma.message.findMany({
                where: { receiverId: userId, deletedAt: null },
                select: { senderId: true },
                distinct: ["senderId"],
            });

            const partnerIds = [
                ...new Set([
                    ...sentMessages.map((m) => m.receiverId),
                    ...receivedMessages.map((m) => m.senderId),
                ]),
            ];

            // Get conversation details
            const conversations = await Promise.all(
                partnerIds.map(async (partnerId) => {
                    const partner = await prisma.user.findUnique({
                        where: { id: partnerId },
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            role: true,
                        },
                    });

                    const lastMessage = await prisma.message.findFirst({
                        where: {
                            OR: [
                                { senderId: userId, receiverId: partnerId },
                                { senderId: partnerId, receiverId: userId },
                            ],
                            deletedAt: null,
                        },
                        orderBy: { createdAt: "desc" },
                    });

                    const unreadCount = await prisma.message.count({
                        where: {
                            senderId: partnerId,
                            receiverId: userId,
                            isRead: false,
                            deletedAt: null,
                        },
                    });

                    return {
                        partner,
                        lastMessage,
                        unreadCount,
                    };
                })
            );

            // Sort by last message time
            conversations.sort((a, b) => {
                const timeA = a.lastMessage?.createdAt.getTime() || 0;
                const timeB = b.lastMessage?.createdAt.getTime() || 0;
                return timeB - timeA;
            });

            res.json(conversations);
        } catch (error) {
            next(error);
        }
    }
);

// GET CONVERSATION WITH USER
messageRouter.get(
    "/conversation/:userId",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const currentUserId = req.user!.id;
            const partnerId = req.params.userId;

            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: currentUserId, receiverId: partnerId },
                        { senderId: partnerId, receiverId: currentUserId },
                    ],
                    deletedAt: null,
                },
                orderBy: { createdAt: "asc" },
            });

            // Mark messages as read
            await prisma.message.updateMany({
                where: {
                    senderId: partnerId,
                    receiverId: currentUserId,
                    isRead: false,
                },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });

            res.json(messages);
        } catch (error) {
            next(error);
        }
    }
);

// SEND MESSAGE
messageRouter.post(
    "/send",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const data = sendMessageSchema.parse(req.body);

            // Check if receiver exists
            const receiver = await prisma.user.findUnique({
                where: { id: data.receiverId },
            });

            if (!receiver) {
                throw new AppError("Recipient not found", 404);
            }

            const message = await prisma.message.create({
                data: {
                    senderId: req.user!.id,
                    receiverId: data.receiverId,
                    content: data.content,
                    attachments: data.attachments || [],
                },
            });

            // Create notification
            await prisma.notification.create({
                data: {
                    userId: data.receiverId,
                    type: "NEW_MESSAGE",
                    title: "New Message",
                    message: `${req.user!.firstName} ${req.user!.lastName} sent you a message`,
                    link: `/dashboard/messages`,
                },
            });

            res.status(201).json(message);
        } catch (error) {
            next(error);
        }
    }
);

// MARK MESSAGE AS READ
messageRouter.patch(
    "/:id/read",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const message = await prisma.message.findUnique({
                where: { id },
            });

            if (!message) {
                throw new AppError("Message not found", 404);
            }

            if (message.receiverId !== req.user!.id) {
                throw new AppError("Not authorized", 403);
            }

            await prisma.message.update({
                where: { id },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });

            res.json({ message: "Message marked as read" });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE MESSAGE
messageRouter.delete(
    "/:id",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const message = await prisma.message.findUnique({
                where: { id },
            });

            if (!message) {
                throw new AppError("Message not found", 404);
            }

            if (message.senderId !== req.user!.id) {
                throw new AppError("Not authorized", 403);
            }

            await prisma.message.update({
                where: { id },
                data: { deletedAt: new Date() },
            });

            res.json({ message: "Message deleted" });
        } catch (error) {
            next(error);
        }
    }
);
