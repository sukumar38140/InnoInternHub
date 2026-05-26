"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth, withAuth } from "@/lib/auth-context";
import { projectsApi, type Project } from "@/lib/api";

function AllApplicantsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAllApplicants = async () => {
            try {
                // Get all innovator projects
                const userProjects = await projectsApi.getMyProjects();
                setProjects(userProjects.filter(p => p.applicationCount > 0));
            } catch (error) {
                console.error("Failed to load applicants overview:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadAllApplicants();
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applicants Overview</h1>
                <p className="text-slate-500">Manage candidates across all your posted projects</p>
            </div>

            {projects.length === 0 ? (
                <Card className="p-16 text-center bg-white border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Applicants Yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Once students apply to your open projects, they will be listed here.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <Card key={project.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-slate-200 hover:shadow-sm transition-shadow">
                            <div>
                                <h3 className="font-semibold text-lg text-slate-900 mb-1">{project.title}</h3>
                                <div className="flex gap-3 text-sm text-slate-500">
                                    <span>{project.applicationCount} total applicants</span>
                                    <span>•</span>
                                    <span className="text-green-600 font-semibold">{project.status}</span>
                                </div>
                            </div>
                            <Link href={`/dashboard/innovator/ideas/${project.id}/applicants`}>
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    Review Applicants <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default withAuth(AllApplicantsPage, ["INNOVATOR"]);
