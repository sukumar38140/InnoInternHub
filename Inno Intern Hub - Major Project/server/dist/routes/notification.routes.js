"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
exports.notificationRouter = (0, express_1.Router)();
// GET NOTIFICATIONS
exports.notificationRouter.get("/", auth_1.authenticate, async (req, res, next) => {
    try {
        const { page = "1", limit = "20", unreadOnly = "false" } = req.query;
        const where = { userId: req.user.id };
        if (unreadOnly === "true") {
            where.isRead = false;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [notifications, total, unreadCount] = await Promise.all([
            prisma_1.prisma.notification.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.notification.count({ where }),
            prisma_1.prisma.notification.count({
                where: { userId: req.user.id, isRead: false },
            }),
        ]);
        res.json({
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// MARK AS READ
exports.notificationRouter.patch("/:id/read", auth_1.authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.notification.update({
            where: { id: id, userId: req.user.id },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        res.json({ message: "Notification marked as read" });
    }
    catch (error) {
        next(error);
    }
});
// MARK ALL AS READ
exports.notificationRouter.patch("/read-all", auth_1.authenticate, async (req, res, next) => {
    try {
        await prisma_1.prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
        res.json({ message: "All notifications marked as read" });
    }
    catch (error) {
        next(error);
    }
});
// DELETE NOTIFICATION
exports.notificationRouter.delete("/:id", auth_1.authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.prisma.notification.delete({
            where: { id: id, userId: req.user.id },
        });
        res.json({ message: "Notification deleted" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=notification.routes.js.map