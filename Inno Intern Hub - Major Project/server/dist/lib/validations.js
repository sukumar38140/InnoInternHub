"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = exports.sendMessageSchema = exports.reviewSubmissionSchema = exports.submitMilestoneSchema = exports.updateApplicationSchema = exports.applyToProjectSchema = exports.updateProjectSchema = exports.createProjectSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    firstName: zod_1.z.string().min(1, "First name is required").max(50),
    lastName: zod_1.z.string().min(1, "Last name is required").max(50),
    role: zod_1.z.enum(["STUDENT", "INNOVATOR", "INVESTOR"]),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
    password: zod_1.z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    bio: zod_1.z.string().max(500).optional(),
    phone: zod_1.z.string().optional(),
    avatar: zod_1.z.string().url().optional(),
    // Student fields
    education: zod_1.z.string().optional(),
    university: zod_1.z.string().optional(),
    graduationYear: zod_1.z.number().min(2000).max(2050).optional(),
    skills: zod_1.z.array(zod_1.z.string()).max(20).optional(),
    portfolioUrl: zod_1.z.string().url().optional(),
    // Innovator fields
    companyName: zod_1.z.string().optional(),
    companyWebsite: zod_1.z.string().url().optional(),
    designation: zod_1.z.string().optional(),
    // Investor fields
    investorType: zod_1.z.string().optional(),
    investmentRange: zod_1.z.string().optional(),
    sectors: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, "Title must be at least 5 characters").max(100),
    description: zod_1.z.string().min(50, "Description must be at least 50 characters").max(5000),
    shortDescription: zod_1.z.string().max(200).optional(),
    domain: zod_1.z.string().min(1, "Domain is required"),
    skills: zod_1.z.array(zod_1.z.string()).min(1, "At least one skill required").max(10),
    difficulty: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
    tags: zod_1.z.array(zod_1.z.string()).max(10).optional(),
    teamSize: zod_1.z.number().min(1).max(10).default(1),
    duration: zod_1.z.number().min(1).max(52),
    commitment: zod_1.z.enum(["Part-time", "Full-time"]).default("Part-time"),
    isPaid: zod_1.z.boolean().default(false),
    stipend: zod_1.z.number().min(0).max(100000).optional(),
    stipendPeriod: zod_1.z.enum(["per_month", "per_milestone", "total"]).optional(),
    applicationDeadline: zod_1.z.string().datetime().optional(),
    milestones: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string().min(1).max(100),
        description: zod_1.z.string().max(500).optional(),
        deliverables: zod_1.z.array(zod_1.z.string()).optional(),
        deadline: zod_1.z.string().datetime().optional(),
    })).optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
exports.applyToProjectSchema = zod_1.z.object({
    coverLetter: zod_1.z.string().min(50, "Cover letter must be at least 50 characters").max(2000),
    relevantExperience: zod_1.z.string().max(1000).optional(),
    portfolioLinks: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
    availability: zod_1.z.string().max(200).optional(),
});
exports.updateApplicationSchema = zod_1.z.object({
    status: zod_1.z.enum(["SHORTLISTED", "ACCEPTED", "REJECTED"]),
    feedback: zod_1.z.string().max(500).optional(),
});
exports.submitMilestoneSchema = zod_1.z.object({
    description: zod_1.z.string().max(1000).optional(),
    files: zod_1.z.array(zod_1.z.string().url()).max(10).optional(),
    links: zod_1.z.array(zod_1.z.string().url()).max(10).optional(),
});
exports.reviewSubmissionSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "NEEDS_REVISION"]),
    feedback: zod_1.z.string().max(500).optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
});
exports.sendMessageSchema = zod_1.z.object({
    receiverId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(5000),
    attachments: zod_1.z.array(zod_1.z.string().url()).max(5).optional(),
});
exports.createReviewSchema = zod_1.z.object({
    projectId: zod_1.z.string().uuid(),
    revieweeId: zod_1.z.string().uuid(),
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().max(1000).optional(),
    communicationRating: zod_1.z.number().min(1).max(5).optional(),
    qualityRating: zod_1.z.number().min(1).max(5).optional(),
    timelinessRating: zod_1.z.number().min(1).max(5).optional(),
});
//# sourceMappingURL=validations.js.map