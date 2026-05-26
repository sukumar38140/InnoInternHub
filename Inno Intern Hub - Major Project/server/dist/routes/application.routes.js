"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
const validations_1 = require("../lib/validations");
exports.applicationRouter = (0, express_1.Router)();
// GET MY APPLICATIONS (Student)
exports.applicationRouter.get("/", auth_1.authenticate, (0, auth_1.authorize)("STUDENT"), async (req, res, next) => {
    try {
        const applications = await prisma_1.prisma.application.findMany({
            where: { studentId: req.user.id },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        domain: true,
                        status: true,
                        stipend: true,
                        innovator: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                companyName: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
            orderBy: { appliedAt: "desc" },
        });
        res.json(applications);
    }
    catch (error) {
        next(error);
    }
});
// APPLY TO PROJECT
exports.applicationRouter.post("/", auth_1.authenticate, (0, auth_1.authorize)("STUDENT"), async (req, res, next) => {
    try {
        const data = validations_1.applyToProjectSchema.parse(req.body);
        const { projectId } = req.body;
        if (!projectId) {
            throw new error_handler_1.AppError("Project ID is required", 400);
        }
        // Check if project exists and is open
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project || project.deletedAt) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.status !== "OPEN") {
            throw new error_handler_1.AppError("This project is not accepting applications", 400);
        }
        if (project.applicationDeadline && new Date() > project.applicationDeadline) {
            throw new error_handler_1.AppError("Application deadline has passed", 400);
        }
        // Check for existing application
        const existingApplication = await prisma_1.prisma.application.findUnique({
            where: {
                projectId_studentId: {
                    projectId,
                    studentId: req.user.id,
                },
            },
        });
        if (existingApplication) {
            throw new error_handler_1.AppError("You have already applied to this project", 400);
        }
        // Create application
        const application = await prisma_1.prisma.application.create({
            data: {
                projectId,
                studentId: req.user.id,
                ...data,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        innovatorId: true,
                    },
                },
            },
        });
        // Update application count
        await prisma_1.prisma.project.update({
            where: { id: projectId },
            data: { applicationCount: { increment: 1 } },
        });
        // Notify innovator
        await prisma_1.prisma.notification.create({
            data: {
                userId: project.innovatorId,
                type: "APPLICATION_RECEIVED",
                title: "New Application",
                message: `${req.user.firstName} ${req.user.lastName} applied to "${project.title}"`,
                link: `/dashboard/innovator/projects/${projectId}/applicants`,
            },
        });
        res.status(201).json(application);
    }
    catch (error) {
        next(error);
    }
});
// GET PROJECT APPLICATIONS (Innovator)
exports.applicationRouter.get("/project/:projectId", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        // Check project ownership
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new error_handler_1.AppError("Project not found", 404);
        }
        if (project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        const applications = await prisma_1.prisma.application.findMany({
            where: { projectId },
            include: {
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        university: true,
                        skills: true,
                        portfolioUrl: true,
                        points: true,
                        level: true,
                    },
                },
            },
            orderBy: { appliedAt: "desc" },
        });
        res.json(applications);
    }
    catch (error) {
        next(error);
    }
});
// UPDATE APPLICATION STATUS (Accept/Reject)
exports.applicationRouter.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)("INNOVATOR", "ADMIN"), async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = validations_1.updateApplicationSchema.parse(req.body);
        const application = await prisma_1.prisma.application.findUnique({
            where: { id: id },
            include: {
                project: true,
                student: true,
            },
        });
        if (!application) {
            throw new error_handler_1.AppError("Application not found", 404);
        }
        if (application.project.innovatorId !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        const updateData = {
            status: data.status,
            feedback: data.feedback,
        };
        if (data.status === "ACCEPTED") {
            updateData.acceptedAt = new Date();
            // Update project status to IN_PROGRESS if first accepted student
            await prisma_1.prisma.project.update({
                where: { id: application.projectId },
                data: { status: "IN_PROGRESS" },
            });
        }
        else if (data.status === "REJECTED") {
            updateData.rejectedAt = new Date();
        }
        else if (data.status === "SHORTLISTED") {
            updateData.shortlistedAt = new Date();
        }
        const updated = await prisma_1.prisma.application.update({
            where: { id: id },
            data: updateData,
        });
        // Notify student
        const notificationType = data.status === "ACCEPTED"
            ? "APPLICATION_ACCEPTED"
            : data.status === "REJECTED"
                ? "APPLICATION_REJECTED"
                : "SYSTEM";
        await prisma_1.prisma.notification.create({
            data: {
                userId: application.studentId,
                type: notificationType,
                title: `Application ${data.status.toLowerCase()}`,
                message: `Your application for "${application.project.title}" has been ${data.status.toLowerCase()}.`,
                link: `/dashboard/student/applications`,
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// WITHDRAW APPLICATION
exports.applicationRouter.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)("STUDENT"), async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await prisma_1.prisma.application.findUnique({
            where: { id: id },
        });
        if (!application) {
            throw new error_handler_1.AppError("Application not found", 404);
        }
        if (application.studentId !== req.user.id) {
            throw new error_handler_1.AppError("Not authorized", 403);
        }
        if (application.status === "ACCEPTED") {
            throw new error_handler_1.AppError("Cannot withdraw accepted application", 400);
        }
        await prisma_1.prisma.application.update({
            where: { id: id },
            data: { status: "WITHDRAWN" },
        });
        // Decrease application count
        await prisma_1.prisma.project.update({
            where: { id: application.projectId },
            data: { applicationCount: { decrement: 1 } },
        });
        res.json({ message: "Application withdrawn" });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=application.routes.js.map