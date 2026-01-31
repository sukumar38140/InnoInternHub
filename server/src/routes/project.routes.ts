import { Router } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error-handler";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { createProjectSchema, updateProjectSchema } from "../lib/validations";

export const projectRouter = Router();

// GET ALL PROJECTS (public, with filters)
projectRouter.get("/", async (req, res, next) => {
    try {
        const {
            domain,
            skills,
            difficulty,
            isPaid,
            status,
            search,
            page = "1",
            limit = "10",
            sort = "createdAt",
            order = "desc",
        } = req.query;

        const where: any = {
            isPublished: true,
            deletedAt: null,
        };

        if (domain) {
            where.domain = domain as string;
        }

        if (skills) {
            const skillsArray = (skills as string).split(",");
            where.skills = { hasSome: skillsArray };
        }

        if (difficulty) {
            where.difficulty = difficulty as string;
        }

        if (isPaid === "true") {
            where.isPaid = true;
        }

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
                orderBy: { [sort as string]: order },
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

// GET SINGLE PROJECT
projectRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const project = await prisma.project.findUnique({
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
            throw new AppError("Project not found", 404);
        }

        // Increment view count
        await prisma.project.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        res.json(project);
    } catch (error) {
        next(error);
    }
});

// CREATE PROJECT (Innovator only)
projectRouter.post(
    "/",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const data = createProjectSchema.parse(req.body);
            const { milestones, ...projectData } = data;

            const project = await prisma.project.create({
                data: {
                    ...projectData,
                    innovatorId: req.user!.id,
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
        } catch (error) {
            next(error);
        }
    }
);

// UPDATE PROJECT
projectRouter.patch(
    "/:id",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;
            const data = updateProjectSchema.parse(req.body);

            // Check ownership
            const project = await prisma.project.findUnique({
                where: { id },
            });

            if (!project) {
                throw new AppError("Project not found", 404);
            }

            if (project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized to update this project", 403);
            }

            const updated = await prisma.project.update({
                where: { id },
                data,
            });

            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
);

// PUBLISH PROJECT
projectRouter.post(
    "/:id/publish",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const project = await prisma.project.findUnique({
                where: { id },
            });

            if (!project) {
                throw new AppError("Project not found", 404);
            }

            if (project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            const updated = await prisma.project.update({
                where: { id },
                data: {
                    isPublished: true,
                    status: "OPEN",
                    publishedAt: new Date(),
                },
            });

            res.json(updated);
        } catch (error) {
            next(error);
        }
    }
);

// COMPLETE PROJECT
projectRouter.post(
    "/:id/complete",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const project = await prisma.project.findUnique({
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
                throw new AppError("Project not found", 404);
            }

            if (project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            // Update project status
            await prisma.project.update({
                where: { id },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                },
            });

            // Generate certificates for accepted students
            const innovator = await prisma.user.findUnique({
                where: { id: project.innovatorId },
            });

            for (const app of project.applications) {
                const certificateNo = `IIH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

                await prisma.certificate.create({
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
                await prisma.user.update({
                    where: { id: app.studentId },
                    data: { points: { increment: 100 } },
                });

                // Create notification
                await prisma.notification.create({
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
        } catch (error) {
            next(error);
        }
    }
);

// DELETE PROJECT (soft delete)
projectRouter.delete(
    "/:id",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const { id } = req.params;

            const project = await prisma.project.findUnique({
                where: { id },
            });

            if (!project) {
                throw new AppError("Project not found", 404);
            }

            if (project.innovatorId !== req.user!.id && req.user!.role !== "ADMIN") {
                throw new AppError("Not authorized", 403);
            }

            await prisma.project.update({
                where: { id },
                data: { deletedAt: new Date(), status: "CLOSED" },
            });

            res.json({ message: "Project deleted" });
        } catch (error) {
            next(error);
        }
    }
);

// GET MY PROJECTS (Innovator)
projectRouter.get(
    "/my/list",
    authenticate,
    authorize("INNOVATOR", "ADMIN"),
    async (req: AuthRequest, res, next) => {
        try {
            const projects = await prisma.project.findMany({
                where: {
                    innovatorId: req.user!.id,
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
        } catch (error) {
            next(error);
        }
    }
);
