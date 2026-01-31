"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Users, Lightbulb, Wallet, Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, withAuth } from "@/lib/auth-context";

function InnovatorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalViews: 0,
        totalApplications: 0,
        activeProjects: 0,
        stipendsPaid: 0,
    });
    const [ideas, setIdeas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Load projects from storage
                const { storage } = await import("@/lib/storage");
                const userProjects = storage.getProjects(user?.id);
                setIdeas(userProjects);

                // Calculate stats from projects
                const totalViews = userProjects.reduce((acc, p) => acc + (p.viewCount || 0), 0);
                const totalApplications = userProjects.reduce((acc, p) => acc + (p.applicationCount || 0), 0);
                const activeProjects = userProjects.filter(p => p.status === "PUBLISHED").length;

                setStats({
                    totalViews,
                    totalApplications,
                    activeProjects,
                    stipendsPaid: 0, // Placeholder
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
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome, {user?.firstName}!
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Post your ideas and find talented students
                    </p>
                </div>
                <Link href="/dashboard/innovator/post">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Plus className="w-4 h-4" /> Post New Idea
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-slate-500 text-sm">Total Views</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.totalViews.toLocaleString()}</div>
                </Card>

                <Card className="p-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-medium text-slate-500 text-sm">Applications</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.totalApplications}</div>
                </Card>

                <Card className="p-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Lightbulb className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-slate-500 text-sm">Active Projects</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.activeProjects}</div>
                </Card>

                <Card className="p-5 bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Wallet className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="font-medium text-slate-500 text-sm">Stipends Paid</h3>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">₹{stats.stipendsPaid.toLocaleString()}</div>
                </Card>
            </div>

            {/* Your Ideas */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Your Ideas</h2>
                </div>

                {ideas.length === 0 ? (
                    <Card className="p-16 text-center bg-white border-slate-200">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lightbulb className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Ideas Posted Yet</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Share your innovative project idea and connect with talented students who can help bring it to life.
                        </p>
                        <Link href="/dashboard/innovator/post">
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
                                <Plus className="w-4 h-4" /> Post Your First Idea
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                            <Card key={idea.id} className="p-5 flex items-center justify-between gap-4 bg-white border-slate-200">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900">{idea.title}</h3>
                                    <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                        <span>{idea.viewCount} views</span>
                                        <span>{idea.applicationCount} applicants</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/dashboard/innovator/ideas/${idea.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Link href={`/dashboard/innovator/ideas/${idea.id}/applicants`}>
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">View Applicants</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
                <Link href="/dashboard/innovator/post" className="block">
                    <Card className="p-5 bg-white border-slate-200 hover:border-blue-200 transition-colors cursor-pointer group h-full">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">📝 Post New Idea</h3>
                                <p className="text-sm text-slate-500">Share your project and find talent</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Card className="p-5 bg-white border-slate-200 hover:border-green-200 transition-colors cursor-pointer group h-full">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                            <Wallet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">💳 Add Funds</h3>
                            <p className="text-sm text-slate-500">Top up for intern stipends</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 bg-white border-slate-200 hover:border-purple-200 transition-colors cursor-pointer group h-full">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">📊 View Analytics</h3>
                            <p className="text-sm text-slate-500">See project performance</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default withAuth(InnovatorDashboard, ["INNOVATOR"]);
