"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Lightbulb, GraduationCap, TrendingUp, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/lib/auth-context";

const roles = [
    {
        id: "STUDENT" as UserRole,
        label: "Student",
        description: "Find internships & build portfolio",
        icon: GraduationCap,
        color: "blue",
        benefits: ["Real project experience", "Verified certificates", "Earn stipends"],
    },
    {
        id: "INNOVATOR" as UserRole,
        label: "Innovator",
        description: "Post ideas & hire talent",
        icon: Lightbulb,
        color: "purple",
        benefits: ["Access to skilled talent", "IP protection", "Milestone management"],
    },
    {
        id: "INVESTOR" as UserRole,
        label: "Investor",
        description: "Discover startups & talent",
        icon: TrendingUp,
        color: "green",
        benefits: ["Early deal flow", "Talent reports", "Direct intros"],
    },
];

function RegisterForm() {
    const { register, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const preselectedRole = searchParams.get("role")?.toUpperCase() as UserRole | null;

    const [step, setStep] = useState(preselectedRole && roles.some(r => r.id === preselectedRole) ? 2 : 1);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(
        preselectedRole && roles.some(r => r.id === preselectedRole) ? preselectedRole : null
    );
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    // Clear error when form changes
    useEffect(() => {
        if (error) setError(null);
    }, [formData.firstName, formData.lastName, formData.email, formData.password, selectedRole]);

    const handleRoleSelect = (roleId: UserRole) => {
        setSelectedRole(roleId);
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedRole) {
            setError("Please select a role.");
            setStep(1);
            return;
        }

        // Validate password
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: selectedRole, // ROLE IS PERMANENT - SET ONCE AT REGISTRATION
            });

            if (!result.success) {
                setError(result.error || "Registration failed. Please try again.");
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
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                )}>
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div className={cn("w-12 h-0.5", step >= 2 ? "bg-blue-600" : "bg-slate-200")} />
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                )}>
                    2
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Join InnoInternHUB</h1>
                        <p className="text-slate-500 mt-2">Choose how you want to participate</p>
                        <p className="text-xs text-amber-600 mt-1 font-medium">⚠️ This choice is permanent and cannot be changed later</p>
                    </div>

                    <div className="space-y-3">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <Card
                                    key={role.id}
                                    className={cn(
                                        "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                                        selectedRole === role.id
                                            ? "border-blue-500 bg-blue-50/50"
                                            : "border-transparent hover:border-slate-200"
                                    )}
                                    onClick={() => handleRoleSelect(role.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "p-3 rounded-xl",
                                            role.color === "blue" && "bg-blue-100 text-blue-600",
                                            role.color === "purple" && "bg-purple-100 text-purple-600",
                                            role.color === "green" && "bg-green-100 text-green-600",
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{role.label}</h3>
                                            <p className="text-sm text-slate-500 mb-2">{role.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {role.benefits.map((benefit, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                        {benefit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {step === 2 && selectedRole && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
                        <p className="text-slate-500 mt-2">
                            Signing up as{" "}
                            <span className={cn(
                                "font-medium capitalize",
                                selectedRole === "STUDENT" && "text-blue-600",
                                selectedRole === "INNOVATOR" && "text-purple-600",
                                selectedRole === "INVESTOR" && "text-green-600",
                            )}>
                                {selectedRole.toLowerCase()}
                            </span>
                            <button onClick={() => setStep(1)} className="ml-2 text-sm underline text-slate-500 hover:text-slate-700">
                                Change
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                        autoComplete="given-name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>

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
                                    disabled={isSubmitting}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
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
                                    minLength={8}
                                    disabled={isSubmitting}
                                    autoComplete="new-password"
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
                            <p className="text-xs text-slate-500">Must be at least 8 characters</p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 mt-2"
                            disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.email || formData.password.length < 8}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-slate-500">
                        By creating an account, you agree to our{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            )}

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
            <RegisterForm />
        </Suspense>
    );
}
