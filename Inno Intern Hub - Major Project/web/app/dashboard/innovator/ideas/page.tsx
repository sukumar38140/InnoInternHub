"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth, withAuth } from "@/lib/auth-context";
import { projectsApi, type Project } from "@/lib/api";

function InnovatorIdeasPage() {
    const { user } = useAuth();
    const [ideas, setIdeas] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadIdeas = async () => {
            try {
                const userProjects = await projectsApi.getMyProjects();
                setIdeas(userProjects);
            } catch (error) {
                console.error("Failed to load ideas:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadIdeas();
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Ideas</h1>
                    <p className="text-slate-500">Manage your posted project ideas</p>
                </div>
                <Link href="/dashboard/innovator/post">
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Plus className="w-4 h-4" /> Post New Idea
                    </Button>
                </Link>
            </div>

            {ideas.length === 0 ? (
                <Card className="p-16 text-center bg-white border-slate-200">
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lightbulb className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Ideas Posted Yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Share your innovative project idea and connect with talented students.
                    </p>
                    <Link href="/dashboard/innovator/post">
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Post Your First Idea
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-4">
                    {ideas.map((idea) => (
                        <Card key={idea.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-slate-200">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg text-slate-900 mb-1">{idea.title}</h3>
                                <p className="text-sm text-slate-500 mb-3">{idea.shortDescription || (idea.description ? idea.description.substring(0, 120) + "..." : "")}</p>
                                <div className="flex gap-4 mt-1 text-sm text-slate-400">
                                    <span>👁️ {idea.viewCount} views</span>
                                    <span>👥 {idea.applicationCount} applicants</span>
                                    <span>📅 Created {new Date(idea.createdAt).toLocaleDateString()}</span>
                                    <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">{idea.status.toLowerCase()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={`/explore/${idea.id}`}>
                                    <Button variant="outline" size="sm">View Public</Button>
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
    );
}

export default withAuth(InnovatorIdeasPage, ["INNOVATOR"]);
