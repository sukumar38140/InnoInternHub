// API Configuration and HTTP Client

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    requireAuth?: boolean;
}

class ApiError extends Error {
    status: number;
    details?: any;

    constructor(message: string, status: number, details?: any) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// Main API call function
export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, requireAuth = true } = options;

    const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (requireAuth && accessToken) {
        requestHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "include", // For cookies (refresh token)
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && requireAuth) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry request with new token
            requestHeaders["Authorization"] = `Bearer ${accessToken}`;
            const retryResponse = await fetch(`${API_URL}${endpoint}`, {
                method,
                headers: requestHeaders,
                body: body ? JSON.stringify(body) : undefined,
                credentials: "include",
            });

            if (!retryResponse.ok) {
                const error = await retryResponse.json().catch(() => ({}));
                throw new ApiError(error.error || "Request failed", retryResponse.status, error.details);
            }

            return retryResponse.json();
        }

        // Refresh failed - redirect to login
        if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
        }
        throw new ApiError("Session expired", 401);
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(error.error || "Request failed", response.status, error.details);
    }

    // Handle empty responses
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
}

// Refresh token function
async function refreshAccessToken(): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        setAccessToken(data.accessToken);
        return true;
    } catch {
        return false;
    }
}

// Auth API
export const authApi = {
    register: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: "STUDENT" | "INNOVATOR" | "INVESTOR";
    }) => api("/auth/register", { method: "POST", body: data, requireAuth: false }),

    login: (data: { email: string; password: string }) =>
        api<{ accessToken: string; user: User }>("/auth/login", {
            method: "POST",
            body: data,
            requireAuth: false,
        }),

    logout: () => api("/auth/logout", { method: "POST" }),

    verifyEmail: (token: string) =>
        api("/auth/verify-email", { method: "POST", body: { token }, requireAuth: false }),

    forgotPassword: (email: string) =>
        api("/auth/forgot-password", { method: "POST", body: { email }, requireAuth: false }),

    resetPassword: (token: string, password: string) =>
        api("/auth/reset-password", { method: "POST", body: { token, password }, requireAuth: false }),

    getMe: () => api<User>("/auth/me"),
};

// Projects API
export const projectsApi = {
    list: (params?: {
        domain?: string;
        skills?: string;
        difficulty?: string;
        isPaid?: boolean;
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.set(key, String(value));
                }
            });
        }
        return api<{ projects: Project[]; pagination: Pagination }>(
            `/projects?${searchParams.toString()}`,
            { requireAuth: false }
        );
    },

    get: (id: string) => api<Project>(`/projects/${id}`, { requireAuth: false }),

    create: (data: CreateProjectInput) =>
        api<Project>("/projects", { method: "POST", body: data }),

    update: (id: string, data: Partial<CreateProjectInput>) =>
        api<Project>(`/projects/${id}`, { method: "PATCH", body: data }),

    publish: (id: string) => api(`/projects/${id}/publish`, { method: "POST" }),

    complete: (id: string) => api(`/projects/${id}/complete`, { method: "POST" }),

    delete: (id: string) => api(`/projects/${id}`, { method: "DELETE" }),

    getMyProjects: () => api<Project[]>("/projects/my/list"),
};

// Applications API
export const applicationsApi = {
    getMyApplications: () => api<Application[]>("/applications"),

    apply: (projectId: string, data: ApplyInput) =>
        api<Application>("/applications", { method: "POST", body: { projectId, ...data } }),

    getProjectApplications: (projectId: string) =>
        api<Application[]>(`/applications/project/${projectId}`),

    updateStatus: (id: string, data: { status: string; feedback?: string }) =>
        api<Application>(`/applications/${id}`, { method: "PATCH", body: data }),

    withdraw: (id: string) => api(`/applications/${id}`, { method: "DELETE" }),
};

// Certificates API
export const certificatesApi = {
    getMyCertificates: () => api<Certificate[]>("/certificates"),

    verify: (certificateNo: string) =>
        api<CertificateVerification>(`/certificates/verify/${certificateNo}`, { requireAuth: false }),

    download: (id: string) => `${API_URL}/certificates/${id}/download`,
};

// User API
export const userApi = {
    getProfile: (id: string) => api<PublicProfile>(`/users/${id}`, { requireAuth: false }),

    updateProfile: (data: UpdateProfileInput) =>
        api<User>("/users/me", { method: "PATCH", body: data }),

    deleteAccount: () => api("/users/me", { method: "DELETE" }),

    getStats: () => api<DashboardStats>("/users/me/stats"),
};

// Messages API
export const messagesApi = {
    getConversations: () => api<Conversation[]>("/messages/conversations"),

    getConversation: (userId: string) => api<Message[]>(`/messages/conversation/${userId}`),

    send: (receiverId: string, content: string) =>
        api<Message>("/messages/send", { method: "POST", body: { receiverId, content } }),

    markAsRead: (id: string) => api(`/messages/${id}/read`, { method: "PATCH" }),
};

// Notifications API
export const notificationsApi = {
    get: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => {
        const searchParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    searchParams.set(key, String(value));
                }
            });
        }
        return api<{ notifications: Notification[]; unreadCount: number; pagination: Pagination }>(
            `/notifications?${searchParams.toString()}`
        );
    },

    markAsRead: (id: string) => api(`/notifications/${id}/read`, { method: "PATCH" }),

    markAllAsRead: () => api("/notifications/read-all", { method: "PATCH" }),
};

// Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "STUDENT" | "INNOVATOR" | "INVESTOR" | "ADMIN";
    avatar?: string;
    bio?: string;
    phone?: string;
    skills: string[];
    education?: string;
    university?: string;
    graduationYear?: number;
    portfolioUrl?: string;
    companyName?: string;
    companyWebsite?: string;
    designation?: string;
    investorType?: string;
    investmentRange?: string;
    sectors: string[];
    points: number;
    level: string;
    badges: string[];
    isVerified: boolean;
    createdAt: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    domain: string;
    skills: string[];
    difficulty: string;
    tags: string[];
    teamSize: number;
    duration: number;
    commitment: string;
    isPaid: boolean;
    stipend?: number;
    stipendPeriod?: string;
    startDate?: string;
    endDate?: string;
    applicationDeadline?: string;
    status: "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
    isPublished: boolean;
    isFeatured: boolean;
    viewCount: number;
    applicationCount: number;
    coverImage?: string;
    createdAt: string;
    innovator: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        companyName?: string;
        isVerified: boolean;
    };
    milestones?: Milestone[];
    _count?: {
        applications: number;
    };
}

export interface Milestone {
    id: string;
    title: string;
    description?: string;
    order: number;
    deliverables: string[];
    deadline?: string;
    status: string;
}

export interface Application {
    id: string;
    projectId: string;
    studentId: string;
    status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
    coverLetter?: string;
    relevantExperience?: string;
    portfolioLinks: string[];
    availability?: string;
    feedback?: string;
    appliedAt: string;
    project?: Project;
    student?: User;
}

export interface Certificate {
    id: string;
    certificateNo: string;
    studentId: string;
    projectId: string;
    studentName: string;
    projectTitle: string;
    innovatorName: string;
    skills: string[];
    startDate: string;
    endDate: string;
    status: "PENDING" | "ISSUED" | "REVOKED";
    pdfUrl?: string;
    issuedAt?: string;
}

export interface CertificateVerification {
    valid: boolean;
    message?: string;
    certificate?: {
        certificateNo: string;
        studentName: string;
        projectTitle: string;
        innovatorName: string;
        skills: string[];
        startDate: string;
        endDate: string;
        issuedAt: string;
        domain: string;
    };
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    attachments: string[];
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}

export interface Conversation {
    partner: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        role: string;
    };
    lastMessage: Message;
    unreadCount: number;
}

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface DashboardStats {
    // Student stats
    applications?: Record<string, number>;
    totalApplications?: number;
    certificates?: number;
    points?: number;
    level?: string;
    // Innovator stats
    projects?: Record<string, number>;
    totalProjects?: number;
    totalViews?: number;
    // Investor stats
    interests?: Record<string, number>;
    totalInterests?: number;
    availableProjects?: number;
}

export interface PublicProfile {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    bio?: string;
    skills: string[];
    university?: string;
    companyName?: string;
    isVerified: boolean;
    points: number;
    level: string;
    badges: string[];
    createdAt: string;
    _count: {
        projects: number;
        certificates: number;
    };
}

export interface CreateProjectInput {
    title: string;
    description: string;
    shortDescription?: string;
    domain: string;
    skills: string[];
    difficulty?: string;
    tags?: string[];
    teamSize?: number;
    duration: number;
    commitment?: string;
    isPaid?: boolean;
    stipend?: number;
    stipendPeriod?: string;
    applicationDeadline?: string;
    milestones?: {
        title: string;
        description?: string;
        deliverables?: string[];
        deadline?: string;
    }[];
}

export interface ApplyInput {
    coverLetter: string;
    relevantExperience?: string;
    portfolioLinks?: string[];
    availability?: string;
}

export interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    avatar?: string;
    education?: string;
    university?: string;
    graduationYear?: number;
    skills?: string[];
    portfolioUrl?: string;
    companyName?: string;
    companyWebsite?: string;
    designation?: string;
    investorType?: string;
    investmentRange?: string;
    sectors?: string[];
}
