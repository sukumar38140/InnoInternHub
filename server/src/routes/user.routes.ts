import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, AuthRequest } from "../middleware/auth";
import { updateProfileSchema } from "../lib/validations";

export const userRouter = Router();

// GET PUBLIC PROFILE
userRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
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
            throw new AppError("User not found", 404);
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// UPDATE PROFILE
userRouter.patch(
    "/me",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const data = updateProfileSchema.parse(req.body);

            const updated = await prisma.user.update({
                where: { id: req.user!.id },
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
        } catch (error) {
            next(error);
        }
    }
);

// DELETE ACCOUNT
userRouter.delete(
    "/me",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            // Soft delete
            await prisma.user.update({
                where: { id: req.user!.id },
                data: {
                    isActive: false,
                    deletedAt: new Date(),
                },
            });

            // Clear refresh tokens
            await prisma.refreshToken.deleteMany({
                where: { userId: req.user!.id },
            });

            res.json({ message: "Account deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
);

// GET DASHBOARD STATS
userRouter.get(
    "/me/stats",
    authenticate,
    async (req: AuthRequest, res, next) => {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;

            let stats: any = {};

            if (role === "STUDENT") {
                const [applications, certificates, points] = await Promise.all([
                    prisma.application.groupBy({
                        by: ["status"],
                        where: { studentId: userId },
                        _count: true,
                    }),
                    prisma.certificate.count({
                        where: { studentId: userId, status: "ISSUED" },
                    }),
                    prisma.user.findUnique({
                        where: { id: userId },
                        select: { points: true, level: true },
                    }),
                ]);

                stats = {
                    applications: applications.reduce((acc, curr) => {
                        acc[curr.status] = curr._count;
                        return acc;
                    }, {} as Record<string, number>),
                    totalApplications: applications.reduce((acc, curr) => acc + curr._count, 0),
                    certificates,
                    points: points?.points || 0,
                    level: points?.level || "Beginner",
                };
            } else if (role === "INNOVATOR") {
                const [projects, totalViews, totalApplications] = await Promise.all([
                    prisma.project.groupBy({
                        by: ["status"],
                        where: { innovatorId: userId, deletedAt: null },
                        _count: true,
                    }),
                    prisma.project.aggregate({
                        where: { innovatorId: userId, deletedAt: null },
                        _sum: { viewCount: true },
                    }),
                    prisma.application.count({
                        where: { project: { innovatorId: userId } },
                    }),
                ]);

                stats = {
                    projects: projects.reduce((acc, curr) => {
                        acc[curr.status] = curr._count;
                        return acc;
                    }, {} as Record<string, number>),
                    totalProjects: projects.reduce((acc, curr) => acc + curr._count, 0),
                    totalViews: totalViews._sum.viewCount || 0,
                    totalApplications,
                };
            } else if (role === "INVESTOR") {
                const [interests, totalProjects] = await Promise.all([
                    prisma.investment.groupBy({
                        by: ["status"],
                        where: { investorId: userId },
                        _count: true,
                    }),
                    prisma.project.count({
                        where: { isPublished: true, status: "COMPLETED" },
                    }),
                ]);

                stats = {
                    interests: interests.reduce((acc, curr) => {
                        acc[curr.status] = curr._count;
                        return acc;
                    }, {} as Record<string, number>),
                    totalInterests: interests.reduce((acc, curr) => acc + curr._count, 0),
                    availableProjects: totalProjects,
                };
            }

            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
);
