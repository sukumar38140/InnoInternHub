import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { applyToProjectSchema, updateApplicationSchema } from "../lib/validations";

export const applicationRouter = Router();

// GET MY APPLICATIONS (Student)
applicationRouter.get(
    "/",
    authenticate,
    authorize("STUDENT"),
    async (req: AuthRequest, res, next) => {
        try {
            const applications = await prisma.application.findMany({
                where: { studentId: req.user!.id },
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
        } catch (error) {
            next(error);
        }
    }
);

// APPLY TO PROJECT
applicationRouter.post(
    "/",
    authenticate,
    authorize("STUDENT"),
    async (req: AuthRequest, res, next) => {
        try {
            const data = applyToProjectSchema.parse(req.body);
            const { projectId } = req.body;

            if (!projectId) {
                throw new AppError("Project ID is required", 400);
            }

            // Check if project exists and is open
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            if (!project || project.deletedAt) {
                throw new AppError("Project not found", 404);
            }

            if (project.status !== "OPEN") {
                throw new AppError("This project is not accepting applications", 400);
            }

            if (project.applicationDeadline && new Date() > project.applicationDeadline) {
                throw new AppError("Application deadline has passed", 400);
            }

            // Check for existing application
            const existingApplication = await prisma.application.findUnique({
                where: {
                    projectId_studentId: {
                        projectId,
                        studentId: req.user!.id,
                    },
                },
            });

            if (existingApplication) {
                throw new AppError("You have already applied to this project", 400);
            }

            // Create application
            const application = await prisma.application.create({
                data: {
                    projectId,
                    studentId: req.user!.id,
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
            await prisma.project.update({
                where: { id: projectId },
                data: { applicationCount: { increment: 1 } },
            });

            // Notify innovator
            await prisma.notification.create({
                data: {
                    userId: project.innovatorId,
                    type: "APPLICATION_RECEIVED",
                    title: "New Application",
                    message: `${req.user!.firstName} ${req.user!.lastName} applied to "${project.title}"`,
                    link: `/dashboard/innovator/projects/${projectId}/applicants`,
                },
            });

            res.status(201).json(application);
        } catch (error) {
            next(error);
        }
    }
);

// GET PROJECT APPLICATIONS (Innovator)
applicationRouter.get(
    "/project/:projectId",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { projectId } = req.params;

            // Check project ownership
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });

            if (!project) {
                throw new AppError("Project not found", 404);
            }

            if (project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            const applications = await prisma.application.findMany({
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
        } catch (error) {
            next(error);
        }
    }
);

// UPDATE APPLICATION STATUS (Accept/Reject)
applicationRouter.patch(
    "/:id",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;
            const data = updateApplicationSchema.parse(req.body);

            const application = await prisma.application.findUnique({
                where: { id },
                include: {
                    project: true,
                    student: true,
                },
            });

            if (!application) {
                throw new AppError("Application not found", 404);
            }

            if (application.project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            const updateData: any = {
                status: data.status,
                feedback: data.feedback,
            };

            if (data.status === "ACCEPTED") {
                updateData.acceptedAt = new Date();

                // Update project status to IN_PROGRESS if first accepted student
                await prisma.project.update({
                    where: { id: application.projectId },
                    data: { status: "IN_PROGRESS" },
                });
            } else if (data.status === "REJECTED") {
                updateData.rejectedAt = new Date();
            } else if (data.status === "SHORTLISTED") {
                updateData.shortlistedAt = new Date();
            }

            const updated = await prisma.application.update({
                where: { id },
                data: updateData,
            });

            // Notify student
            const notificationType = data.status === "ACCEPTED"
                ? "APPLICATION_ACCEPTED"
                : data.status === "REJECTED"
                    ? "APPLICATION_REJECTED"
                    : "SYSTEM";

            await prisma.notification.create({
                data: {
                    userId: application.studentId,
                    type: notificationType,
                    title: `Application ${data.status.toLowerCase()}`,
                    message: `Your application for "${application.project.title}" has been ${data.status.toLowerCase()}.`,
                    link: `/dashboard/student/applications`,
                },
            });

            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
);

// WITHDRAW APPLICATION
applicationRouter.delete(
    "/:id",
    authenticate,
    authorize("STUDENT"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const application = await prisma.application.findUnique({
                where: { id },
            });

            if (!application) {
                throw new AppError("Application not found", 404);
            }

            if (application.studentId !== req.user!.id) {
                throw new AppError("Not authorized", 403);
            }

            if (application.status === "ACCEPTED") {
                throw new AppError("Cannot withdraw accepted application", 400);
            }

            await prisma.application.update({
                where: { id },
                data: { status: "WITHDRAWN" },
            });

            // Decrease application count
            await prisma.project.update({
                where: { id: application.projectId },
                data: { applicationCount: { decrement: 1 } },
            });

            res.json({ message: "Application withdrawn" });
        } catch (error) {
            next(error);
        }
    }
);
