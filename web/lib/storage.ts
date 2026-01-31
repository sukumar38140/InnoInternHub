
export interface Project {
    id: string;
    innovatorId: string;
    title: string;
    description: string;
    shortDescription?: string;
    domain: string;
    skills: string[];
    difficulty: string;
    teamSize: number;
    duration: number;
    commitment: string;
    isPaid: boolean;
    stipend?: number;
    applicationDeadline: string;
    milestones: Array<{ title: string; description: string }>;
    createdAt: string;
    status: "DRAFT" | "PUBLISHED" | "CLOSED";
    viewCount: number;
    applicationCount: number;
}

const STORAGE_KEYS = {
    PROJECTS: "innohub_projects",
};

export const storage = {
    getProjects: (innovatorId?: string): Project[] => {
        if (typeof window === "undefined") return [];
        const projectsStr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        if (!projectsStr) return [];
        const projects: Project[] = JSON.parse(projectsStr);
        if (innovatorId) {
            return projects.filter(p => p.innovatorId === innovatorId);
        }
        return projects;
    },

    createProject: (project: Omit<Project, "id" | "createdAt" | "viewCount" | "applicationCount">): Project => {
        const projects = storage.getProjects();
        const newProject: Project = {
            ...project,
            id: `proj_${Date.now()}`,
            createdAt: new Date().toISOString(),
            viewCount: 0,
            applicationCount: 0,
        };
        const updatedProjects = [...projects, newProject];
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
        return newProject;
    },

    // Add other methods as needed
};
