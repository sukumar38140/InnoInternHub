"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Briefcase,
    Award,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    FileCheck,
    Eye,
    Activity,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth, withAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

// Admin Dashboard - Shows platform analytics
function AdminDashboard() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    // In production, this would fetch from the API
    const [stats, setStats] = useState({
        totalUsers: 0,
        usersByRole: { STUDENT: 0, INNOVATOR: 0, INVESTOR: 0 },
        totalProjects: 0,
        projectsByStatus: { OPEN: 0, IN_PROGRESS: 0, COMPLETED: 0 },
        totalApplications: 0,
        totalCertificates: 0,
        recentUsers: [] as any[],
        recentProjects: [] as any[],
    });

    useEffect(() => {
        const loadStats = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Simulate fetch
            setIsLoading(false);
        };
        loadStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-500 mt-1">Platform overview and management</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Users</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalUsers}</p>
                            <p className="text-xs text-green-600 flex items-center mt-2">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> New this week
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Projects</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProjects}</p>
                            <p className="text-xs text-slate-500 mt-2">
                                {stats.projectsByStatus.OPEN || 0} active
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Applications</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalApplications}</p>
                            <p className="text-xs text-slate-500 mt-2">All time</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl">
                            <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Certificates</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCertificates}</p>
                            <p className="text-xs text-slate-500 mt-2">Issued</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-xl">
                            <Award className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* User Distribution */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Students</h3>
                            <p className="text-2xl font-bold text-blue-600">{stats.usersByRole.STUDENT || 0}</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }} />
                    </div>
                </Card>

                <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Innovators</h3>
                            <p className="text-2xl font-bold text-purple-600">{stats.usersByRole.INNOVATOR || 0}</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "0%" }} />
                    </div>
                </Card>

                <Card className="p-6 bg-white border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Investors</h3>
                            <p className="text-2xl font-bold text-green-600">{stats.usersByRole.INVESTOR || 0}</p>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }} />
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/users">
                    <Card className="p-5 bg-white border-slate-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <UserPlus className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Manage Users</h3>
                                <p className="text-xs text-slate-500">View and edit users</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/projects">
                    <Card className="p-5 bg-white border-slate-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <Briefcase className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Moderate Projects</h3>
                                <p className="text-xs text-slate-500">Review and approve</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/certificates">
                    <Card className="p-5 bg-white border-slate-200 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                                <Award className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Certificates</h3>
                                <p className="text-xs text-slate-500">Manage certificates</p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link href="/dashboard/admin/analytics">
                    <Card className="p-5 bg-white border-slate-200 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Analytics</h3>
                                <p className="text-xs text-slate-500">Detailed insights</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-white border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Users</h3>
                    {stats.recentUsers.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">No users yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentUsers.map((user: any) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                                            {user.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs text-slate-500">{user.role}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-6 bg-white border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Recent Projects</h3>
                    {stats.recentProjects.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">No projects yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentProjects.map((project: any) => (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900 truncate max-w-[200px]">{project.title}</p>
                                        <p className="text-xs text-slate-500">by {project.innovator?.firstName}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === "OPEN"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-100 text-slate-600"
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default withAuth(AdminDashboard, ["ADMIN"]);
