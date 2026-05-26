import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<["STUDENT", "INNOVATOR", "INVESTOR"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    role: "STUDENT" | "INNOVATOR" | "INVESTOR";
    password: string;
}, {
    email: string;
    firstName: string;
    lastName: string;
    role: "STUDENT" | "INNOVATOR" | "INVESTOR";
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
    password: string;
}, {
    token: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    education: z.ZodOptional<z.ZodString>;
    university: z.ZodOptional<z.ZodString>;
    graduationYear: z.ZodOptional<z.ZodNumber>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    portfolioUrl: z.ZodOptional<z.ZodString>;
    companyName: z.ZodOptional<z.ZodString>;
    companyWebsite: z.ZodOptional<z.ZodString>;
    designation: z.ZodOptional<z.ZodString>;
    investorType: z.ZodOptional<z.ZodString>;
    investmentRange: z.ZodOptional<z.ZodString>;
    sectors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    phone?: string | undefined;
    education?: string | undefined;
    university?: string | undefined;
    graduationYear?: number | undefined;
    skills?: string[] | undefined;
    portfolioUrl?: string | undefined;
    companyName?: string | undefined;
    companyWebsite?: string | undefined;
    designation?: string | undefined;
    investorType?: string | undefined;
    investmentRange?: string | undefined;
    sectors?: string[] | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    phone?: string | undefined;
    education?: string | undefined;
    university?: string | undefined;
    graduationYear?: number | undefined;
    skills?: string[] | undefined;
    portfolioUrl?: string | undefined;
    companyName?: string | undefined;
    companyWebsite?: string | undefined;
    designation?: string | undefined;
    investorType?: string | undefined;
    investmentRange?: string | undefined;
    sectors?: string[] | undefined;
}>;
export declare const createProjectSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodString>;
    domain: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    difficulty: z.ZodDefault<z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    teamSize: z.ZodDefault<z.ZodNumber>;
    duration: z.ZodNumber;
    commitment: z.ZodDefault<z.ZodEnum<["Part-time", "Full-time"]>>;
    isPaid: z.ZodDefault<z.ZodBoolean>;
    stipend: z.ZodOptional<z.ZodNumber>;
    stipendPeriod: z.ZodOptional<z.ZodEnum<["per_month", "per_milestone", "total"]>>;
    applicationDeadline: z.ZodOptional<z.ZodString>;
    milestones: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        deliverables: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        deadline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    skills: string[];
    title: string;
    description: string;
    domain: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    teamSize: number;
    duration: number;
    commitment: "Part-time" | "Full-time";
    isPaid: boolean;
    shortDescription?: string | undefined;
    tags?: string[] | undefined;
    stipend?: number | undefined;
    stipendPeriod?: "per_month" | "per_milestone" | "total" | undefined;
    applicationDeadline?: string | undefined;
    milestones?: {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }[] | undefined;
}, {
    skills: string[];
    title: string;
    description: string;
    domain: string;
    duration: number;
    shortDescription?: string | undefined;
    difficulty?: "Beginner" | "Intermediate" | "Advanced" | undefined;
    tags?: string[] | undefined;
    teamSize?: number | undefined;
    commitment?: "Part-time" | "Full-time" | undefined;
    isPaid?: boolean | undefined;
    stipend?: number | undefined;
    stipendPeriod?: "per_month" | "per_milestone" | "total" | undefined;
    applicationDeadline?: string | undefined;
    milestones?: {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }[] | undefined;
}>;
export declare const updateProjectSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    domain: z.ZodOptional<z.ZodString>;
    skills: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    difficulty: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    teamSize: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    duration: z.ZodOptional<z.ZodNumber>;
    commitment: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Part-time", "Full-time"]>>>;
    isPaid: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    stipend: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    stipendPeriod: z.ZodOptional<z.ZodOptional<z.ZodEnum<["per_month", "per_milestone", "total"]>>>;
    applicationDeadline: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    milestones: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        deliverables: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        deadline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    skills?: string[] | undefined;
    title?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    domain?: string | undefined;
    difficulty?: "Beginner" | "Intermediate" | "Advanced" | undefined;
    tags?: string[] | undefined;
    teamSize?: number | undefined;
    duration?: number | undefined;
    commitment?: "Part-time" | "Full-time" | undefined;
    isPaid?: boolean | undefined;
    stipend?: number | undefined;
    stipendPeriod?: "per_month" | "per_milestone" | "total" | undefined;
    applicationDeadline?: string | undefined;
    milestones?: {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }[] | undefined;
}, {
    skills?: string[] | undefined;
    title?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    domain?: string | undefined;
    difficulty?: "Beginner" | "Intermediate" | "Advanced" | undefined;
    tags?: string[] | undefined;
    teamSize?: number | undefined;
    duration?: number | undefined;
    commitment?: "Part-time" | "Full-time" | undefined;
    isPaid?: boolean | undefined;
    stipend?: number | undefined;
    stipendPeriod?: "per_month" | "per_milestone" | "total" | undefined;
    applicationDeadline?: string | undefined;
    milestones?: {
        title: string;
        description?: string | undefined;
        deliverables?: string[] | undefined;
        deadline?: string | undefined;
    }[] | undefined;
}>;
export declare const applyToProjectSchema: z.ZodObject<{
    coverLetter: z.ZodString;
    relevantExperience: z.ZodOptional<z.ZodString>;
    portfolioLinks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    availability: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    coverLetter: string;
    relevantExperience?: string | undefined;
    portfolioLinks?: string[] | undefined;
    availability?: string | undefined;
}, {
    coverLetter: string;
    relevantExperience?: string | undefined;
    portfolioLinks?: string[] | undefined;
    availability?: string | undefined;
}>;
export declare const updateApplicationSchema: z.ZodObject<{
    status: z.ZodEnum<["SHORTLISTED", "ACCEPTED", "REJECTED"]>;
    feedback: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "SHORTLISTED" | "ACCEPTED" | "REJECTED";
    feedback?: string | undefined;
}, {
    status: "SHORTLISTED" | "ACCEPTED" | "REJECTED";
    feedback?: string | undefined;
}>;
export declare const submitMilestoneSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    links: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    files?: string[] | undefined;
    links?: string[] | undefined;
}, {
    description?: string | undefined;
    files?: string[] | undefined;
    links?: string[] | undefined;
}>;
export declare const reviewSubmissionSchema: z.ZodObject<{
    status: z.ZodEnum<["APPROVED", "NEEDS_REVISION"]>;
    feedback: z.ZodOptional<z.ZodString>;
    rating: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "APPROVED" | "NEEDS_REVISION";
    feedback?: string | undefined;
    rating?: number | undefined;
}, {
    status: "APPROVED" | "NEEDS_REVISION";
    feedback?: string | undefined;
    rating?: number | undefined;
}>;
export declare const sendMessageSchema: z.ZodObject<{
    receiverId: z.ZodString;
    content: z.ZodString;
    attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    receiverId: string;
    content: string;
    attachments?: string[] | undefined;
}, {
    receiverId: string;
    content: string;
    attachments?: string[] | undefined;
}>;
export declare const createReviewSchema: z.ZodObject<{
    projectId: z.ZodString;
    revieweeId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
    communicationRating: z.ZodOptional<z.ZodNumber>;
    qualityRating: z.ZodOptional<z.ZodNumber>;
    timelinessRating: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    rating: number;
    revieweeId: string;
    comment?: string | undefined;
    communicationRating?: number | undefined;
    qualityRating?: number | undefined;
    timelinessRating?: number | undefined;
}, {
    projectId: string;
    rating: number;
    revieweeId: string;
    comment?: string | undefined;
    communicationRating?: number | undefined;
    qualityRating?: number | undefined;
    timelinessRating?: number | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ApplyToProjectInput = z.infer<typeof applyToProjectSchema>;
//# sourceMappingURL=validations.d.ts.map