"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, CheckCircle, TrendingUp, Star, Award, Search, Inbox, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, withAuth } from "@/lib/auth-context";
import { userApi } from "@/lib/api";

function StudentDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        activeApplications: 0,
        completedProjects: 0,
        innovationPoints: 0,
        currentLevel: "Beginner",
        pendingReviews: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // In production: const stats = await userApi.getStats();
                // Simulate loading data based on user
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data logic using actual user data
                setStats({
                    activeApplications: 0,
                    completedProjects: 0,
                    innovationPoints: user?.points || 0,
                    currentLevel: user?.level || "Beginner",
                    pendingReviews: 0,
                });
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadDashboard();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome, {user?.firstName}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Start your innovation journey today
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-xs text-slate-500">Current Level</p>
                        <p className="text-sm font-bold text-blue-700">{stats.currentLevel}</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-slate-500">Active Applications</h3>
                    </div>
                    <div className="text-4xl font-bold text-slate-900">{stats.activeApplications}</div>
                    {stats.pendingReviews > 0 && (
                        <div className="mt-3 text-xs text-blue-600 font-medium flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            {stats.pendingReviews} Waiting for Review
                        </div>
                    )}
                </Card>

                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-medium text-slate-500">Completed Projects</h3>
                    </div>
                    <div className="text-4xl font-bold text-slate-900">{stats.completedProjects}</div>
                </Card>

                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Star className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-slate-500">Innovation Points</h3>
                    </div>
                    <div className="text-4xl font-bold text-slate-900">{stats.innovationPoints.toLocaleString()}</div>
                </Card>
            </div>

            {/* My Applications */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">My Applications</h2>
                </div>

                <Card className="p-10 text-center bg-white border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">No Applications Yet</h3>
                    <p className="text-slate-500 mb-6">Start exploring and apply to exciting projects</p>
                    <Link href="/explore">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Search className="w-4 h-4 mr-2" /> Browse Opportunities
                        </Button>
                    </Link>
                </Card>
            </div>

            {/* Recommended Projects */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
                    <Link href="/explore">
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                            Browse All <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Recommendation cards would be mapped here */}
                    <Card className="p-10 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 col-span-full">
                        <h3 className="font-bold text-slate-900 mb-2">Complete Your Profile</h3>
                        <p className="text-slate-500 mb-4">Add skills and interests to see recommended projects.</p>
                        <Link href="/dashboard/student/portfolio">
                            <Button variant="outline" className="bg-white hover:bg-slate-50">
                                Update Profile
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Protect route using HOC
export default withAuth(StudentDashboard, ["STUDENT"]);
