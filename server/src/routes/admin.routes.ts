import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

export const adminRouter = Router();

// All admin routes require ADMIN role
adminRouter.use(authenticate, authorize("ADMIN"));

// GET DASHBOARD ANALYTICS
adminRouter.get("/analytics", async (req: AuthRequest, res, next) => {
    try {
        const [
            totalUsers,
            usersByRole,
            totalProjects,
            projectsByStatus,
            totalApplications,
            totalCertificates,
            recentUsers,
            recentProjects,
        ] = await Promise.all([
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.user.groupBy({
                by: ["role"],
                where: { deletedAt: null },
                _count: true,
            }),
            prisma.project.count({ where: { deletedAt: null } }),
            prisma.project.groupBy({
                by: ["status"],
                where: { deletedAt: null },
                _count: true,
            }),
            prisma.application.count(),
            prisma.certificate.count({ where: { status: "ISSUED" } }),
            prisma.user.findMany({
                where: { deletedAt: null },
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            }),
            prisma.project.findMany({
                where: { deletedAt: null },
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    createdAt: true,
                    innovator: {
                        select: { firstName: true, lastName: true },
                    },
                },
            }),
        ]);

        res.json({
            totalUsers,
            usersByRole: usersByRole.reduce((acc, curr) => {
                acc[curr.role] = curr._count;
                return acc;
            }, {} as Record<string, number>),
            totalProjects,
            projectsByStatus: projectsByStatus.reduce((acc, curr) => {
                acc[curr.status] = curr._count;
                return acc;
            }, {} as Record<string, number>),
            totalApplications,
            totalCertificates,
            recentUsers,
            recentProjects,
        });
    } catch (error) {
        next(error);
    }
});

// GET ALL USERS
adminRouter.get("/users", async (req: AuthRequest, res, next) => {
    try {
        const { role, search, page = "1", limit = "20" } = req.query;

        const where: any = { deletedAt: null };

        if (role) {
            where.role = role as string;
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: "insensitive" } },
                { lastName: { contains: search as string, mode: "insensitive" } },
                { email: { contains: search as string, mode: "insensitive" } },
            ];
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    avatar: true,
                    isActive: true,
                    isVerified: true,
                    emailVerified: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: {
                        select: {
                            projects: true,
                            applications: true,
                            certificates: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        res.json({
            users,
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
});

// UPDATE USER
adminRouter.patch("/users/:id", async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;
        const { role, isActive, isVerified } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(role && { role }),
                ...(isActive !== undefined && { isActive }),
                ...(isVerified !== undefined && { isVerified }),
            },
        });

        // Log audit
        await prisma.auditLog.create({
            data: {
                userId: req.user!.id,
                action: "UPDATE_USER",
                entity: "User",
                entityId: id,
                newValue: { role, isActive, isVerified },
            },
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
});

// DELETE USER
adminRouter.delete("/users/:id", async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;

        await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });

        await prisma.auditLog.create({
            data: {
                userId: req.user!.id,
                action: "DELETE_USER",
                entity: "User",
                entityId: id,
            },
        });

        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
});

// GET ALL PROJECTS
adminRouter.get("/projects", async (req: AuthRequest, res, next) => {
    try {
        const { status, search, page = "1", limit = "20" } = req.query;

        const where: any = { deletedAt: null };

        if (status) {
            where.status = status as string;
        }

        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: "insensitive" } },
                { description: { contains: search as string, mode: "insensitive" } },
            ];
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    innovator: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: {
                            applications: true,
                            certificates: true,
                        },
                    },
                },
            }),
            prisma.project.count({ where }),
        ]);

        res.json({
            projects,
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
});

// MODERATE PROJECT
adminRouter.patch("/projects/:id/moderate", async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body; // action: 'approve', 'reject', 'feature', 'unfeature'

        const project = await prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new AppError("Project not found", 404);
        }

        let updateData: any = {};

        switch (action) {
            case "approve":
                updateData = { isPublished: true, status: "OPEN" };
                break;
            case "reject":
                updateData = { isPublished: false, status: "CLOSED" };
                break;
            case "feature":
                updateData = { isFeatured: true };
                break;
            case "unfeature":
                updateData = { isFeatured: false };
                break;
            default:
                throw new AppError("Invalid action", 400);
        }

        await prisma.project.update({
            where: { id },
            data: updateData,
        });

        // Notify innovator
        await prisma.notification.create({
            data: {
                userId: project.innovatorId,
                type: "SYSTEM",
                title: `Project ${action}ed`,
                message: reason || `Your project "${project.title}" has been ${action}ed by admin.`,
                link: `/dashboard/innovator/projects/${id}`,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId: req.user!.id,
                action: `PROJECT_${action.toUpperCase()}`,
                entity: "Project",
                entityId: id,
                newValue: { action, reason },
            },
        });

        res.json({ message: `Project ${action}ed successfully` });
    } catch (error) {
        next(error);
    }
});

// GET ALL CERTIFICATES
adminRouter.get("/certificates", async (req: AuthRequest, res, next) => {
    try {
        const { status, page = "1", limit = "20" } = req.query;

        const where: any = {};

        if (status) {
            where.status = status as string;
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [certificates, total] = await Promise.all([
            prisma.certificate.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: {
                    student: {
                        select: { id: true, firstName: true, lastName: true, email: true },
                    },
                    project: {
                        select: { id: true, title: true },
                    },
                },
            }),
            prisma.certificate.count({ where }),
        ]);

        res.json({
            certificates,
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
});

// REVOKE CERTIFICATE
adminRouter.patch("/certificates/:id/revoke", async (req: AuthRequest, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const certificate = await prisma.certificate.findUnique({ where: { id } });

        if (!certificate) {
            throw new AppError("Certificate not found", 404);
        }

        await prisma.certificate.update({
            where: { id },
            data: {
                status: "REVOKED",
                revokedAt: new Date(),
            },
        });

        // Notify student
        await prisma.notification.create({
            data: {
                userId: certificate.studentId,
                type: "SYSTEM",
                title: "Certificate Revoked",
                message: reason || `Your certificate for "${certificate.projectTitle}" has been revoked.`,
            },
        });

        await prisma.auditLog.create({
            data: {
                userId: req.user!.id,
                action: "REVOKE_CERTIFICATE",
                entity: "Certificate",
                entityId: id,
                newValue: { reason },
            },
        });

        res.json({ message: "Certificate revoked" });
    } catch (error) {
        next(error);
    }
});

// GET AUDIT LOGS
adminRouter.get("/audit-logs", async (req: AuthRequest, res, next) => {
    try {
        const { entity, action, page = "1", limit = "50" } = req.query;

        const where: any = {};

        if (entity) where.entity = entity as string;
        if (action) where.action = action as string;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const take = parseInt(limit as string);

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            prisma.auditLog.count({ where }),
        ]);

        res.json({
            logs,
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
});
