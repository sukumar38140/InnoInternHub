"use client";

import { AuthProvider } from "@/lib/auth-context";
import { ReactNode } from "react";

/**
 * Providers component wrapping the entire application.
 * This is a client component that provides:
 * - Authentication context (user state, login, logout, register)
 * 
 * All global providers should be added here.
 */
export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
