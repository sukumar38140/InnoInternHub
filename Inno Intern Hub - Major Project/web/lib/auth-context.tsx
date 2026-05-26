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
    // Initialize auth state and verify session on mount
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (isInitialized) return;

        const initializeAuth = async () => {
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
                    
                    // Verify token is still valid by calling /auth/me
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
                    try {
                        const response = await fetch(`${API_URL}/auth/me`, {
                            method: "GET",
                            headers: { 
                                "Authorization": `Bearer ${storedToken}`,
                                "Content-Type": "application/json"
                            },
                            credentials: "include",
                        });

                        if (response.ok) {
                            const userData = await response.json();
                            setUser(userData);
                            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
                        } else {
                            // Token is invalid, clear storage
                            localStorage.removeItem(STORAGE_KEYS.USER);
                            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                        }
                    } catch {
                        // Network error - assume token might be valid, restore from storage
                        setUser(parsedUser);
                    }
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
    // LOGIN - Authenticates user via API
    // ---------------------------------------------------------------------------
    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error || "Login failed. Please try again." 
                };
            }

            const data = await response.json();
            
            // Store token and user
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
            setUser(data.user);

            // Redirect to correct dashboard based on role
            const dashboardPath = getDashboardPath(data.user.role);
            router.push(dashboardPath);

            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Network error. Please check your connection.";
            return { success: false, error: message };
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // REGISTER - Creates new user via backend API
    // ---------------------------------------------------------------------------
    const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
        try {
            // Validate input on client side
            if (!data.email || !data.password || !data.firstName || !data.lastName || !data.role) {
                return { success: false, error: "All fields are required." };
            }

            if (data.password.length < 8) {
                return { success: false, error: "Password must be at least 8 characters." };
            }

            if (!/[A-Z]/.test(data.password)) {
                return { success: false, error: "Password must contain at least one uppercase letter." };
            }

            if (!/[0-9]/.test(data.password)) {
                return { success: false, error: "Password must contain at least one number." };
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error || "Registration failed. Please try again." 
                };
            }

            // Registration successful, redirect to login
            router.push("/auth/login?registered=true");
            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : "Network error. Please check your connection.";
            return { success: false, error: message };
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // LOGOUT
    // ---------------------------------------------------------------------------
    const logout = useCallback(async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            
            // Call logout endpoint to clear server-side sessions
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                }).catch(() => {
                    // Ignore errors, continue with local logout
                });
            }
        } catch {
            // Silently fail - proceed with local logout
        } finally {
            setUser(null);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            router.push("/");
        }
    }, [router]);

    // ---------------------------------------------------------------------------
    // REFRESH USER - Sync user state from backend
    // ---------------------------------------------------------------------------
    const refreshUser = useCallback(async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

            if (!token) {
                setUser(null);
                return;
            }

            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                // Token invalid, clear session
                setUser(null);
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
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
