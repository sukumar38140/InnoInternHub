import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    role: z.enum(["STUDENT", "INNOVATOR", "INVESTOR"]),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

export const updateProfileSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional(),

    // Student fields
    education: z.string().optional(),
    university: z.string().optional(),
    graduationYear: z.number().min(2000).max(2050).optional(),
    skills: z.array(z.string()).max(20).optional(),
    portfolioUrl: z.string().url().optional(),

    // Innovator fields
    companyName: z.string().optional(),
    companyWebsite: z.string().url().optional(),
    designation: z.string().optional(),

    // Investor fields
    investorType: z.string().optional(),
    investmentRange: z.string().optional(),
    sectors: z.array(z.string()).optional(),
});

export const createProjectSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z.string().min(50, "Description must be at least 50 characters").max(5000),
    shortDescription: z.string().max(200).optional(),
    domain: z.string().min(1, "Domain is required"),
    skills: z.array(z.string()).min(1, "At least one skill required").max(10),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
    tags: z.array(z.string()).max(10).optional(),
    teamSize: z.number().min(1).max(10).default(1),
    duration: z.number().min(1).max(52),
    commitment: z.enum(["Part-time", "Full-time"]).default("Part-time"),
    isPaid: z.boolean().default(false),
    stipend: z.number().min(0).max(100000).optional(),
    stipendPeriod: z.enum(["per_month", "per_milestone", "total"]).optional(),
    applicationDeadline: z.string().datetime().optional(),
    milestones: z.array(z.object({
        title: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        deliverables: z.array(z.string()).optional(),
        deadline: z.string().datetime().optional(),
    })).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const applyToProjectSchema = z.object({
    coverLetter: z.string().min(50, "Cover letter must be at least 50 characters").max(2000),
    relevantExperience: z.string().max(1000).optional(),
    portfolioLinks: z.array(z.string().url()).max(5).optional(),
    availability: z.string().max(200).optional(),
});

export const updateApplicationSchema = z.object({
    status: z.enum(["SHORTLISTED", "ACCEPTED", "REJECTED"]),
    feedback: z.string().max(500).optional(),
});

export const submitMilestoneSchema = z.object({
    description: z.string().max(1000).optional(),
    files: z.array(z.string().url()).max(10).optional(),
    links: z.array(z.string().url()).max(10).optional(),
});

export const reviewSubmissionSchema = z.object({
    status: z.enum(["APPROVED", "NEEDS_REVISION"]),
    feedback: z.string().max(500).optional(),
    rating: z.number().min(1).max(5).optional(),
});

export const sendMessageSchema = z.object({
    receiverId: z.string().uuid(),
    content: z.string().min(1).max(5000),
    attachments: z.array(z.string().url()).max(5).optional(),
});

export const createReviewSchema = z.object({
    projectId: z.string().uuid(),
    revieweeId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().max(1000).optional(),
    communicationRating: z.number().min(1).max(5).optional(),
    qualityRating: z.number().min(1).max(5).optional(),
    timelinessRating: z.number().min(1).max(5).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ApplyToProjectInput = z.infer<typeof applyToProjectSchema>;
