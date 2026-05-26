"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Sparkles, Target, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, withAuth } from "@/lib/auth-context";

function InvestorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        completedProjects: 0,
        startupsLaunched: 0,
        totalFunding: 0,
        successRate: 0,
    });
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Simulate loading
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data
                setStats({
                    completedProjects: 12,
                    startupsLaunched: 5,
                    totalFunding: 2500000,
                    successRate: 85,
                });
                setProjects([]);
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
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
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
                        Discover promising projects and talent
                    </p>
                </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 bg-white border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900">{stats.completedProjects}</div>
                    <p className="text-sm text-slate-500 mt-1">Projects Completed</p>
                </Card>
                <Card className="p-5 bg-white border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900">{stats.startupsLaunched}</div>
                    <p className="text-sm text-slate-500 mt-1">Startups Launched</p>
                </Card>
                <Card className="p-5 bg-white border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900">₹{(stats.totalFunding / 100000).toFixed(1)}L</div>
                    <p className="text-sm text-slate-500 mt-1">Total Funding Raised</p>
                </Card>
                <Card className="p-5 bg-white border-slate-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-slate-900">{stats.successRate}%</div>
                    <p className="text-sm text-slate-500 mt-1">Success Rate</p>
                </Card>
            </div>

            {/* Hall of Fame */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Trophy className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Hall of Fame</h2>
                            <p className="text-sm text-slate-500">Top performing projects</p>
                        </div>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <Card className="p-16 text-center bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Hall of Fame is Empty</h3>
                        <p className="text-slate-500 max-w-md mx-auto mb-6">
                            Completed projects with exceptional performance will be featured here.
                            Check back soon as student teams finish their innovative work!
                        </p>
                        <Link href="/explore">
                            <Button variant="outline" className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                                <Sparkles className="w-4 h-4" /> View Active Projects
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden bg-white border-slate-200">
                                <div className="h-40 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <Trophy className="w-16 h-16 text-white/30" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{project.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* What We Look For */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">What We Look For</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-5 bg-white border-slate-200">
                        <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4">
                            <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Innovation Score</h3>
                        <p className="text-sm text-slate-500">
                            Projects that solve real problems with novel approaches and clear market differentiation.
                        </p>
                    </Card>

                    <Card className="p-5 bg-white border-slate-200">
                        <div className="p-3 bg-green-50 rounded-xl w-fit mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Growth Potential</h3>
                        <p className="text-sm text-slate-500">
                            Early traction metrics, user engagement, and scalability of the solution.
                        </p>
                    </Card>

                    <Card className="p-5 bg-white border-slate-200">
                        <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Team Quality</h3>
                        <p className="text-sm text-slate-500">
                            Diverse skill sets, execution track record, and commitment level of the team.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withAuth(InvestorDashboard, ["INVESTOR"]);
