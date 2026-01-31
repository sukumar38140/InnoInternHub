import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

export const notificationRouter = Router();

// GET NOTIFICATIONS
notificationRouter.get(
    "/",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { page = "1", limit = "20", unreadOnly = "false" } = req.query;

            const where: any = { userId: req.user!.id };

            if (unreadOnly === "true") {
                where.isRead = false;
            }

            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
            const take = parseInt(limit as string);

            const [notifications, total, unreadCount] = await Promise.all([
                prisma.notification.findMany({
                    where,
                    skip,
                    take,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.notification.count({ where }),
                prisma.notification.count({
                    where: { userId: req.user!.id, isRead: false },
                }),
            ]);

            res.json({
                notifications,
                unreadCount,
                pagination: {
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    total,
                    pages: Math.ceil(total / parseInt(limit as string)),
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// MARK AS READ
notificationRouter.patch(
    "/:id/read",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            await prisma.notification.update({
                where: { id, userId: req.user!.id },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });

            res.json({ message: "Notification marked as read" });
        } catch (error) {
            next(error);
        }
    }
);

// MARK ALL AS READ
notificationRouter.patch(
    "/read-all",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            await prisma.notification.updateMany({
                where: { userId: req.user!.id, isRead: false },
                data: {
                    isRead: true,
                    readAt: new Date(),
                },
            });

            res.json({ message: "All notifications marked as read" });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE NOTIFICATION
notificationRouter.delete(
    "/:id",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            await prisma.notification.delete({
                where: { id, userId: req.user!.id },
            });

            res.json({ message: "Notification deleted" });
        } catch (error) {
            next(error);
        }
    }
);
