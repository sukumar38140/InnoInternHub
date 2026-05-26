"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
exports.adminRouter = (0, express_1.Router)();
// All admin routes require ADMIN role
exports.adminRouter.use(auth_1.authenticate, (0, auth_1.authorize)("ADMIN"));
// GET DASHBOARD ANALYTICS
exports.adminRouter.get("/analytics", async (req, res, next) => {
    try {
        const [totalUsers, usersByRole, totalProjects, projectsByStatus, totalApplications, totalCertificates, recentUsers, recentProjects,] = await Promise.all([
            prisma_1.prisma.user.count({ where: { deletedAt: null } }),
            prisma_1.prisma.user.groupBy({
                by: ["role"],
                where: { deletedAt: null },
                _count: true,
            }),
            prisma_1.prisma.project.count({ where: { deletedAt: null } }),
            prisma_1.prisma.project.groupBy({
                by: ["status"],
                where: { deletedAt: null },
                _count: true,
            }),
            prisma_1.prisma.application.count(),
            prisma_1.prisma.certificate.count({ where: { status: "ISSUED" } }),
            prisma_1.prisma.user.findMany({
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
            prisma_1.prisma.project.findMany({
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
            }, {}),
            totalProjects,
            projectsByStatus: projectsByStatus.reduce((acc, curr) => {
                acc[curr.status] = curr._count;
                return acc;
            }, {}),
            totalApplications,
            totalCertificates,
            recentUsers,
            recentProjects,
        });
    }
    catch (error) {
        next(error);
    }
});
// GET ALL USERS
exports.adminRouter.get("/users", async (req, res, next) => {
    try {
        const { role, search, page = "1", limit = "20" } = req.query;
        const where = { deletedAt: null };
        if (role) {
            where.role = role;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [users, total] = await Promise.all([
            prisma_1.prisma.user.findMany({
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
            prisma_1.prisma.user.count({ where }),
        ]);
        res.json({
            users,
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
// UPDATE USER
exports.adminRouter.patch("/users/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const { role, isActive, isVerified } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: {
                ...(role && { role }),
                ...(isActive !== undefined && { isActive }),
                ...(isVerified !== undefined && { isVerified }),
            },
        });
        // Log audit
        await prisma_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: "UPDATE_USER",
                entity: "User",
                entityId: id,
                newValue: { role, isActive, isVerified },
            },
        });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
// DELETE USER
exports.adminRouter.delete("/users/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        await prisma_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: "DELETE_USER",
                entity: "User",
                entityId: id,
            },
        });
        res.json({ message: "User deleted" });
    }
    catch (error) {
        next(error);
    }
});
// GET ALL PROJECTS
exports.adminRouter.get("/projects", async (req, res, next) => {
    try {
        const { status, search, page = "1", limit = "20" } = req.query;
        const where = { deletedAt: null };
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [projects, total] = await Promise.all([
            prisma_1.prisma.project.findMany({
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
            prisma_1.prisma.project.count({ where }),
        ]);
        res.json({
            projects,
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
// MODERATE PROJECT
exports.adminRouter.patch("/projects/:id/moderate", async (req, res, next) => {
    try {
        const id = req.params.id;
        const { action, reason } = req.body; // action: 'approve', 'reject', 'feature', 'unfeature'
        const project = await prisma_1.prisma.project.findUnique({ where: { id } });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        let updateData = {};
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
                throw new error_handler_1.AppError("Invalid action", 400);
        }
        await prisma_1.prisma.project.update({
            where: { id },
            data: updateData,
        });
        // Notify innovator
        await prisma_1.prisma.notification.create({
            data: {
                userId: project.innovatorId,
                type: "SYSTEM",
                title: `Project ${action}ed`,
                message: reason || `Your project "${project.title}" has been ${action}ed by admin.`,
                link: `/dashboard/innovator/projects/${id}`,
            },
        });
        await prisma_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: `PROJECT_${action.toUpperCase()}`,
                entity: "Project",
                entityId: id,
                newValue: { action, reason },
            },
        });
        res.json({ message: `Project ${action}ed successfully` });
    }
    catch (error) {
        next(error);
    }
});
// GET ALL CERTIFICATES
exports.adminRouter.get("/certificates", async (req, res, next) => {
    try {
        const { status, page = "1", limit = "20" } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [certificates, total] = await Promise.all([
            prisma_1.prisma.certificate.findMany({
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
            prisma_1.prisma.certificate.count({ where }),
        ]);
        res.json({
            certificates,
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
// REVOKE CERTIFICATE
exports.adminRouter.patch("/certificates/:id/revoke", async (req, res, next) => {
    try {
        const id = req.params.id;
        const { reason } = req.body;
        const certificate = await prisma_1.prisma.certificate.findUnique({ where: { id } });
        if (!certificate) {
            throw new error_handler_1.AppError("Certificate not found", 404);
        }
        await prisma_1.prisma.certificate.update({
            where: { id },
            data: {
                status: "REVOKED",
                revokedAt: new Date(),
            },
        });
        // Notify student
        await prisma_1.prisma.notification.create({
            data: {
                userId: certificate.studentId,
                type: "SYSTEM",
                title: "Certificate Revoked",
                message: reason || `Your certificate for "${certificate.projectTitle}" has been revoked.`,
            },
        });
        await prisma_1.prisma.auditLog.create({
            data: {
                userId: req.user.id,
                action: "REVOKE_CERTIFICATE",
                entity: "Certificate",
                entityId: id,
                newValue: { reason },
            },
        });
        res.json({ message: "Certificate revoked" });
    }
    catch (error) {
        next(error);
    }
});
// GET AUDIT LOGS
exports.adminRouter.get("/audit-logs", async (req, res, next) => {
    try {
        const { entity, action, page = "1", limit = "50" } = req.query;
        const where = {};
        if (entity)
            where.entity = entity;
        if (action)
            where.action = action;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);
        const [logs, total] = await Promise.all([
            prisma_1.prisma.auditLog.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
            }),
            prisma_1.prisma.auditLog.count({ where }),
        ]);
        res.json({
            logs,
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
//# sourceMappingURL=admin.routes.js.map