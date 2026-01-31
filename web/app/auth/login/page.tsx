"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const justRegistered = searchParams.get("registered") === "true";

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Clear error when form changes
    useEffect(() => {
        if (error) setError(null);
    }, [formData.email, formData.password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const result = await login(formData.email, formData.password);
            if (!result.success) {
                setError(result.error || "Login failed. Please try again.");
            }
            // If successful, auth context handles redirect
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while checking auth state
    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                <p className="text-slate-500 mt-2">
                    Sign in to continue to your dashboard
                </p>
            </div>

            {/* Success message after registration */}
            {justRegistered && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-medium text-green-800">Account created successfully!</p>
                        <p className="text-sm text-green-600">Please sign in with your credentials.</p>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            autoComplete="email"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-slate-700">Password</Label>
                        <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                    disabled={isSubmitting || !formData.email || !formData.password}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            </form>

            {/* OAuth buttons removed - not implemented for production */}
            {/* When OAuth is fully implemented with backend support, add buttons here */}

            <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up free
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
