"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
const validations_1 = require("../lib/validations");
exports.projectRouter = (0, express_1.Router)();
// GET ALL PROJECTS (public, with filters)
exports.projectRouter.get("/", async (req, res, next) => {
    try {
        const { domain, skills, difficulty, isPaid, status, search, page = "1", limit = "10", sort = "createdAt", order = "desc", } = req.query;
        const where = {
            isPublished: true,
            deletedAt: null,
        };
        if (domain) {
            where.domain = domain;
        }
        if (skills) {
            const skillsArray = skills.split(",");
            where.skills = { hasSome: skillsArray };
        }
        if (difficulty) {
            where.difficulty = difficulty;
        }
        if (isPaid === "true") {
            where.isPaid = true;
        }
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
                include: {
                    innovator: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            companyName: true,
                            isVerified: true,
                        },
                    },
                    _count: {
                        select: {
                            applications: true,
                        },
                    },
                },
                skip,
                take,
                orderBy: { [sort]: order },
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
// GET MY PROJECTS (Innovator)
exports.projectRouter.get("/my/list", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const projects = await prisma_1.prisma.project.findMany({
            where: {
                innovatorId: req.user.id,
                deletedAt: null,
            },
            include: {
                _count: {
                    select: {
                        applications: true,
                        milestones: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(projects);
    }
    catch (error) {
        next(error);
    }
});
// GET SINGLE PROJECT
exports.projectRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
            include: {
                innovator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        bio: true,
                        companyName: true,
                        companyWebsite: true,
                        isVerified: true,
                    },
                },
                milestones: {
                    orderBy: { order: "asc" },
                },
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });
        if (!project || project.deletedAt) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        // Increment view count
        await prisma_1.prisma.project.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        res.json(project);
    }
    catch (error) {
        next(error);
    }
});
// CREATE PROJECT (Innovator only)
exports.projectRouter.post("/", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const data = validations_1.createProjectSchema.parse(req.body);
        const { milestones, ...projectData } = data;
        const project = await prisma_1.prisma.project.create({
            data: {
                ...projectData,
                innovatorId: req.user.id,
                milestones: milestones
                    ? {
                        create: milestones.map((m, index) => ({
                            title: m.title,
                            description: m.description,
                            deliverables: m.deliverables || [],
                            deadline: m.deadline ? new Date(m.deadline) : null,
                            order: index + 1,
                        })),
                    }
                    : undefined,
            },
            include: {
                milestones: true,
            },
        });
        res.status(201).json(project);
    }
    catch (error) {
        next(error);
    }
});
// UPDATE PROJECT
exports.projectRouter.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = validations_1.updateProjectSchema.parse(req.body);
        // Check ownership
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized to update this project", 403);
        }
        const { milestones, ...projectData } = data;
        if (milestones) {
            await prisma_1.prisma.milestone.deleteMany({
                where: { projectId: id },
            });
        }
        const updated = await prisma_1.prisma.project.update({
            where: { id },
            data: {
                ...projectData,
                milestones: milestones
                    ? {
                        create: milestones.map((m, index) => ({
                            title: m.title,
                            description: m.description,
                            deliverables: m.deliverables || [],
                            deadline: m.deadline ? new Date(m.deadline) : null,
                            order: index + 1,
                        })),
                    }
                    : undefined,
            },
            include: {
                milestones: true,
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// PUBLISH PROJECT
exports.projectRouter.post("/:id/publish", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        const updated = await prisma_1.prisma.project.update({
            where: { id },
            data: {
                isPublished: true,
                status: "OPEN",
                publishedAt: new Date(),
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// COMPLETE PROJECT
exports.projectRouter.post("/:id/complete", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
            include: {
                applications: {
                    where: { status: "ACCEPTED" },
                    include: { student: true },
                },
                milestones: true,
            },
        });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        // Update project status
        await prisma_1.prisma.project.update({
            where: { id },
            data: {
                status: "COMPLETED",
                completedAt: new Date(),
            },
        });
        // Generate certificates for accepted students
        const innovator = await prisma_1.prisma.user.findUnique({
            where: { id: project.innovatorId },
        });
        for (const app of project.applications) {
            const certificateNo = `IIH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            await prisma_1.prisma.certificate.create({
                data: {
                    certificateNo,
                    studentId: app.studentId,
                    projectId: id,
                    studentName: `${app.student.firstName} ${app.student.lastName}`,
                    projectTitle: project.title,
                    innovatorName: innovator
                        ? `${innovator.firstName} ${innovator.lastName}`
                        : "InnoInternHUB",
                    skills: project.skills,
                    startDate: project.startDate || project.createdAt,
                    endDate: new Date(),
                    status: "ISSUED",
                    issuedAt: new Date(),
                },
            });
            // Add points to student
            await prisma_1.prisma.user.update({
                where: { id: app.studentId },
                data: { points: { increment: 100 } },
            });
            // Create notification
            await prisma_1.prisma.notification.create({
                data: {
                    userId: app.studentId,
                    type: "CERTIFICATE_ISSUED",
                    title: "Certificate Issued!",
                    message: `Your certificate for "${project.title}" is ready for download.`,
                    link: `/dashboard/student/certificates`,
                },
            });
        }
        res.json({ message: "Project completed and certificates issued" });
    }
    catch (error) {
        next(error);
    }
});
// DELETE PROJECT (soft delete)
exports.projectRouter.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        await prisma_1.prisma.project.update({
            where: { id },
            data: { deletedAt: new Date(), status: "CLOSED" },
        });
        res.json({ message: "Project deleted" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=project.routes.js.map