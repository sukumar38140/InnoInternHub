"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
const validations_1 = require("../lib/validations");
exports.userRouter = (0, express_1.Router)();
// GET DASHBOARD STATS
exports.userRouter.get("/me/stats", auth_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let stats = {};
        if (role === "STUDENT") {
            const [applications, certificates, points] = await Promise.all([
                prisma_1.prisma.application.groupBy({
                    by: ["status"],
                    where: { studentId: userId },
                    _count: true,
                }),
                prisma_1.prisma.certificate.count({
                    where: { studentId: userId, status: "ISSUED" },
                }),
                prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { points: true, level: true },
                }),
            ]);
            stats = {
                applications: applications.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
                totalApplications: applications.reduce((acc, curr) => acc + curr._count, 0),
                certificates,
                points: points?.points || 0,
                level: points?.level || "Beginner",
            };
        }
        else if (role === "INNOVATOR") {
            const [projects, totalViews, totalApplications] = await Promise.all([
                prisma_1.prisma.project.groupBy({
                    by: ["status"],
                    where: { innovatorId: userId, deletedAt: null },
                    _count: true,
                }),
                prisma_1.prisma.project.aggregate({
                    where: { innovatorId: userId, deletedAt: null },
                    _sum: { viewCount: true },
                }),
                prisma_1.prisma.application.count({
                    where: { project: { innovatorId: userId } },
                }),
            ]);
            stats = {
                projects: projects.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
                totalProjects: projects.reduce((acc, curr) => acc + curr._count, 0),
                totalViews: totalViews._sum.viewCount || 0,
                totalApplications,
            };
        }
        else if (role === "INVESTOR") {
            const [interests, totalProjects] = await Promise.all([
                prisma_1.prisma.investment.groupBy({
                    by: ["status"],
                    where: { investorId: userId },
                    _count: true,
                }),
                prisma_1.prisma.project.count({
                    where: { isPublished: true, status: "COMPLETED" },
                }),
            ]);
            stats = {
                interests: interests.reduce((acc, curr) => {
                    acc[curr.status] = curr._count;
                    return acc;
                }, {}),
                totalInterests: interests.reduce((acc, curr) => acc + curr._count, 0),
                availableProjects: totalProjects,
            };
        }
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
});
// GET PUBLIC PROFILE
exports.userRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                bio: true,
                skills: true,
                university: true,
                companyName: true,
                isVerified: true,
                points: true,
                level: true,
                badges: true,
                createdAt: true,
                _count: {
                    select: {
                        projects: true,
                        certificates: true,
                    },
                },
            },
        });
        if (!user) {
            throw new error_handler_1.AppError("User not found", 404);
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
// UPDATE PROFILE
exports.userRouter.patch("/me", auth_1.authenticate, async (req, res, next) => {
    try {
        const data = validations_1.updateProfileSchema.parse(req.body);
        const updated = await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                avatar: true,
                bio: true,
                phone: true,
                skills: true,
                education: true,
                university: true,
                graduationYear: true,
                portfolioUrl: true,
                companyName: true,
                companyWebsite: true,
                designation: true,
                investorType: true,
                investmentRange: true,
                sectors: true,
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// DELETE ACCOUNT
exports.userRouter.delete("/me", auth_1.authenticate, async (req, res, next) => {
    try {
        // Soft delete
        await prisma_1.prisma.user.update({
            where: { id: req.user.id },
            data: {
                isActive: false,
                deletedAt: new Date(),
            },
        });
        // Clear refresh tokens
        await prisma_1.prisma.refreshToken.deleteMany({
            where: { userId: req.user.id },
        });
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=user.routes.js.map