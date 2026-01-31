"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Inbox, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { formatTimeAgo, formatCurrency, type Idea } from "@/lib/mock-service";
import { useEffect, useState } from "react";
import { storage, type Project } from "@/lib/storage";

// Helper to convert Project -> Idea
function mapProjectToIdea(project: Project): Idea {
    // In a real app we'd fetch the innovator details
    // Here we'll mock it based on stored user or generic
    return {
        id: project.id,
        title: project.title,
        description: project.description,
        domain: project.domain,
        stipend: project.stipend || null,
        status: "OPEN",
        tags: project.skills || [],
        postedAt: new Date(project.createdAt),
        deadline: new Date(project.applicationDeadline),
        requirements: [],
        teamSize: project.teamSize,
        applicationsCount: project.applicationCount || 0,
        viewsCount: project.viewCount || 0,
        innovator: {
            id: project.innovatorId,
            name: "Innovator", // We don't have this in project storage, would need user lookup
            verified: true
        }
    };
}

function IdeaCard({ idea }: { idea: Idea }) {
    const postedTimeAgo = formatTimeAgo(idea.postedAt);

    return (
        <Card className="flex flex-col border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 bg-white group cursor-pointer overflow-hidden">
            <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
                            {idea.domain}
                        </Badge>
                        {idea.stipend ? (
                            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 font-medium">
                                {formatCurrency(idea.stipend)}
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="border-orange-200 text-orange-600 bg-orange-50">
                                Volunteer
                            </Badge>
                        )}
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                        {postedTimeAgo}
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {idea.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                        {idea.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                    {idea.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider font-medium">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {idea.innovator.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[120px]">{idea.innovator.name}</span>
                </div>
                <Link href={`/explore/${idea.id}`}>
                    <Button size="sm" className="rounded-full px-5 bg-white border border-slate-200 text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all duration-300">
                        View Details
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

function EmptyState() {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Opportunities Yet</h3>
            <p className="text-slate-500 max-w-md mb-8">
                Be the first to post an innovative project idea and find talented students to bring it to life.
            </p>
            <Link href="/auth/register?role=innovator">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
                    <Plus className="w-4 h-4" /> Post Your First Idea
                </Button>
            </Link>
        </div>
    );
}

export default function ExplorePage() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const domains = ["All", "HealthTech", "CleanTech", "Web3", "EdTech", "FinTech", "AgriTech"];

    useEffect(() => {
        const loadIdeas = async () => {
            try {
                // Determine if we have stored projects
                const projects = storage.getProjects();

                // Map to Idea type
                const mappedIdeas = projects.map(mapProjectToIdea);
                setIdeas(mappedIdeas);
            } catch (error) {
                console.error("Failed to load ideas", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadIdeas();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Search Header */}
            <div className="pt-24 pb-8 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Explore Opportunities</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {isLoading
                                    ? "Loading..."
                                    : ideas.length === 0
                                        ? "No opportunities posted yet"
                                        : `${ideas.length} internship${ideas.length === 1 ? '' : 's'} available`
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                placeholder="Search by title, skill, or domain..."
                                className="pl-11 h-12 text-base bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-300 transition-all rounded-xl"
                            />
                        </div>
                        <Button variant="outline" className="h-12 px-5 gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl">
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                        <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl">
                            Search
                        </Button>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {domains.map((domain) => (
                            <Badge
                                key={domain}
                                variant="outline"
                                className="px-4 py-2 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 bg-white border-slate-200 text-slate-600 transition-colors rounded-full"
                            >
                                {domain}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ideas.length === 0 ? (
                            <EmptyState />
                        ) : (
                            ideas.map((idea) => (
                                <IdeaCard key={idea.id} idea={idea} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
