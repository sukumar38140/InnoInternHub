"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type UserRole = "STUDENT" | "INNOVATOR" | "INVESTOR" | "ADMIN";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
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

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

// =============================================================================
// STORAGE KEYS
// =============================================================================

const STORAGE_KEYS = {
    USER: "innohub_user",
    ACCESS_TOKEN: "innohub_access_token",
} as const;

// =============================================================================
// AUTH CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// =============================================================================
// AUTH PROVIDER COMPONENT
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    // ---------------------------------------------------------------------------
    // Initialize auth state from storage on mount
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (isInitialized) return;

        const initializeAuth = () => {
            try {
                if (typeof window === "undefined") {
                    setIsLoading(false);
                    setIsInitialized(true);
                    return;
                }

                const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
                const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

                if (storedUser && storedToken) {
                    const parsedUser = JSON.parse(storedUser) as User;
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Failed to restore auth state:", error);
                // Clear corrupted data
                localStorage.removeItem(STORAGE_KEYS.USER);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [isInitialized]);

    // ---------------------------------------------------------------------------
    // Persist user to storage when it changes
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!isInitialized) return;
        if (typeof window === "undefined") return;

        if (user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        }
    }, [user, isInitialized]);

    // ---------------------------------------------------------------------------
    // LOGIN - Authenticates user and persists session
    // ---------------------------------------------------------------------------
    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // DEMO MODE: Simulate API call with stored users
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check if user exists in localStorage (registered users)
            const registeredUsersStr = localStorage.getItem("innohub_registered_users");
            const registeredUsers: Record<string, User & { password: string }> = registeredUsersStr
                ? JSON.parse(registeredUsersStr)
                : {};

            const storedUser = registeredUsers[email.toLowerCase()];

            if (!storedUser) {
                return { success: false, error: "No account found with this email. Please register first." };
            }

            if (storedUser.password !== password) {
                return { success: false, error: "Invalid password. Please try again." };
            }

            // Remove password from user object before storing in state
            const { password: _, ...userWithoutPassword } = storedUser;

            // Store token and user
            const mockToken = `demo_token_${Date.now()}`;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, mockToken);
            setUser(userWithoutPassword);

            // Redirect to correct dashboard based on stored role
            const dashboardPath = getDashboardPath(userWithoutPassword.role);
            router.push(dashboardPath);

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Login failed. Please try again.";
            return { success: false, error: message };
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // REGISTER - Creates new user with selected role (PERMANENT)
    // ---------------------------------------------------------------------------
    const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            // Validate input
            if (!data.email || !data.password || !data.firstName || !data.lastName || !data.role) {
                return { success: false, error: "All fields are required." };
            }

            if (data.password.length < 8) {
                return { success: false, error: "Password must be at least 8 characters." };
            }

            // DEMO MODE: Store user in localStorage
            await new Promise(resolve => setTimeout(resolve, 1000));

            const registeredUsersStr = localStorage.getItem("innohub_registered_users");
            const registeredUsers: Record<string, User & { password: string }> = registeredUsersStr
                ? JSON.parse(registeredUsersStr)
                : {};

            const emailLower = data.email.toLowerCase();

            if (registeredUsers[emailLower]) {
                return { success: false, error: "An account with this email already exists." };
            }

            // Create new user with PERMANENT role
            const newUser: User & { password: string } = {
                id: `user_${Date.now()}`,
                email: emailLower,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role, // ROLE IS SET ONCE AND NEVER CHANGES
                password: data.password,
                skills: [],
                sectors: [],
                points: 0,
                level: "Beginner",
                badges: [],
                isVerified: false,
                createdAt: new Date().toISOString(),
            };

            registeredUsers[emailLower] = newUser;
            localStorage.setItem("innohub_registered_users", JSON.stringify(registeredUsers));

            // Redirect to login with success message
            router.push("/auth/login?registered=true");

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
            return { success: false, error: message };
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------------------------
    const logout = useCallback(async () => {
        try {
            // Ignore logout API errors
        } finally {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            router.push("/");
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // REFRESH USER
    // ---------------------------------------------------------------------------
    const refreshUser = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// =============================================================================
// HOOK: useAuth
// =============================================================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// =============================================================================
// HELPER: Get dashboard path
// =============================================================================

export function getDashboardPath(role: UserRole | string): string {
    switch (role) {
        case "STUDENT":
            return "/dashboard/student";
        case "INNOVATOR":
            return "/dashboard/innovator";
        case "INVESTOR":
            return "/dashboard/investor";
        case "ADMIN":
            return "/dashboard/admin";
        default:
            return "/";
    }
}

// =============================================================================
// HELPER: Get user initials
// =============================================================================

export function getUserInitials(user: User | null): string {
    if (!user) return "?";
    const first = user.firstName?.charAt(0)?.toUpperCase() || "";
    const last = user.lastName?.charAt(0)?.toUpperCase() || "";
    return first + last || user.email.charAt(0).toUpperCase();
}

// =============================================================================
// HELPER: Get full name
// =============================================================================

export function getUserFullName(user: User | null): string {
    if (!user) return "Guest";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
}

// =============================================================================
// HOC: withAuth - Protect routes
// =============================================================================

export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles?: string[]
) {
    return function AuthenticatedComponent(props: P) {
        const { user, isLoading, isAuthenticated } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                router.push("/auth/login");
            }

            if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
                router.push(getDashboardPath(user.role));
            }
        }, [isLoading, isAuthenticated, user, router]);

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            );
        }

        if (!isAuthenticated) {
            return null;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            return null;
        }

        return <Component {...props} />;
    };
}
