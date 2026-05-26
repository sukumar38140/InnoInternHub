// ==========================================
// PRODUCTION DATA SERVICE
// Returns empty data by default - only shows user-created content
// ==========================================

export interface User {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "INNOVATOR" | "INVESTOR";
    avatar?: string;
    bio?: string;
    skills?: string[];
    gamificationPoints?: number;
    createdAt: Date;
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    domain: string;
    stipend: number | null;
    status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
    tags: string[];
    postedAt: Date;
    deadline?: Date;
    requirements: string[];
    teamSize: number;
    applicationsCount: number;
    viewsCount: number;
    innovator: {
        id: string;
        name: string;
        avatar?: string;
        verified: boolean;
    };
}

export interface Application {
    id: string;
    ideaId: string;
    ideaTitle: string;
    studentId: string;
    status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "COMPLETED";
    appliedAt: Date;
    message?: string;
    innovatorName: string;
}

export interface CompletedProject {
    id: string;
    title: string;
    description: string;
    domain: string;
    coverImage: string;
    teamMembers: { id: string; name: string; initials: string }[];
    completedAt: Date;
    metrics: { label: string; value: string }[];
    tags: string[];
    isTrending?: boolean;
}

// ==========================================
// EMPTY DATA STORES - Fresh start
// In production, these would be fetched from database
// ==========================================

const IDEAS_DATA: Idea[] = [];
const APPLICATIONS_DATA: Application[] = [];
const COMPLETED_PROJECTS_DATA: CompletedProject[] = [];

// Stats - all zeros for fresh start
const STUDENT_STATS = {
    activeApplications: 0,
    completedProjects: 0,
    innovationPoints: 0,
    currentLevel: "Beginner",
    pendingReviews: 0,
    thisMonthCompletions: 0,
    percentile: "New Member",
};

const INNOVATOR_STATS = {
    totalViews: 0,
    viewsGrowth: 0,
    totalApplications: 0,
    newApplicants: 0,
    activeProjects: 0,
    stipendsPaid: 0,
};

const PLATFORM_STATS = {
    activeProjects: 0,
    studentsHired: 0,
    stipendsPaid: 0,
    universities: 0,
    completedProjects: 0,
    startupsLaunched: 0,
    totalFunding: 0,
    successRate: 0,
};

// ==========================================
// API FUNCTIONS
// ==========================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getIdeas = async (filters?: { domain?: string; paidOnly?: boolean }): Promise<Idea[]> => {
    await delay(100);
    let results = [...IDEAS_DATA];

    if (filters?.domain && filters.domain !== "All") {
        results = results.filter(idea => idea.domain === filters.domain);
    }
    if (filters?.paidOnly) {
        results = results.filter(idea => idea.stipend !== null && idea.stipend > 0);
    }

    return results;
};

export const getIdeaById = async (id: string): Promise<Idea | undefined> => {
    await delay(100);
    return IDEAS_DATA.find(idea => idea.id === id);
};

export const getStudentApplications = async (studentId: string): Promise<Application[]> => {
    await delay(100);
    return APPLICATIONS_DATA.filter(app => app.studentId === studentId);
};

export const getStudentStats = async () => {
    await delay(50);
    return STUDENT_STATS;
};

export const getInnovatorStats = async () => {
    await delay(50);
    return INNOVATOR_STATS;
};

export const getPlatformStats = async () => {
    await delay(50);
    return PLATFORM_STATS;
};

export const getCompletedProjects = async (): Promise<CompletedProject[]> => {
    await delay(100);
    return COMPLETED_PROJECTS_DATA;
};

export const getRecommendedIdeas = async (studentId: string): Promise<Idea[]> => {
    await delay(100);
    return IDEAS_DATA.slice(0, 3);
};

export const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
};
