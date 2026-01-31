"use client";

import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  Calendar,
  CheckCircle2,
  Briefcase,
  Eye,
  MoveLeft,
  Share2,
  BookmarkPlus,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { storage, type Project } from "@/lib/storage";
import { notFound } from "next/navigation";

// Extend Project type for display if needed or just use it
interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Unwrap params using use() hook or await if in async component, but since it's client, use use() or useEffect unwrappin
  // Actually, in Next.js 15+ client components, params is a promise.
  // simpler to just use use() hook if available or await in useEffect.
  // Let's stick to standard useEffect pattern for safety.

  // We can't easily await params in top level of client component. 
  // But we can use `React.use` (experimental) or just trust passed props if Next.js unwrap it?
  // In Next 15, params is Promise. I'll use a state to hold id.

  const [id, setId] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Unwrap params
    params.then(p => {
      setId(p.id);
      // Fetch project
      const found = storage.getProjects().find(proj => proj.id === p.id);
      if (found) {
        setProject(found);
      }
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <Link href="/explore" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
              <MoveLeft className="w-4 h-4 mr-2" /> Back to Explore
            </Link>
            <Card className="p-16 bg-white border-slate-200 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Project Not Found</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                This project doesn&apos;t exist yet or may have been removed. Check back later.
              </p>
              <Link href="/explore">
                <Button>Browse Available Projects</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/explore" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8 bg-white border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Badge className="mb-3 bg-green-100 text-green-700 hover:bg-green-100">Open</Badge>
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight">{project.title}</h1>
                    <p className="text-slate-500 mt-2 text-lg">{project.shortDescription}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0 text-slate-400 hover:text-blue-600">
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8 text-sm text-slate-500 border-y border-slate-100 py-4">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> {project.viewCount} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> {project.applicationCount} applications
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Posted {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="prose prose-slate max-w-none">
                  <h3 className="text-lg font-semibold text-slate-900">Description</h3>
                  <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">{project.description}</p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.milestones && project.milestones.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="text-lg font-semibold mb-4 text-slate-900">Project Milestones</h3>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 bg-white border border-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{milestone.title}</p>
                            {milestone.description && (
                              <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-white border-slate-200 shadow-sm sticky top-24">
                <h3 className="font-semibold text-slate-900 mb-5 border-b border-slate-100 pb-3">Project Details</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Duration</p>
                      <p className="text-sm font-medium text-slate-700">{project.duration} weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Team Size</p>
                      <p className="text-sm font-medium text-slate-700">{project.teamSize} position(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Commitment</p>
                      <p className="text-sm font-medium text-slate-700">{project.commitment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Stipend</p>
                      <p className={`text-sm font-medium ${project.isPaid ? "text-green-600" : "text-slate-700"}`}>
                        {project.isPaid && project.stipend ? `₹${project.stipend.toLocaleString()}` : "Unpaid"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Deadline</p>
                      <p className="text-sm font-medium text-slate-700">
                        {new Date(project.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={`/explore/${project.id}/apply`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-md transition-all h-12 text-base font-semibold" size="lg">
                    Apply Now
                  </Button>
                </Link>
                <p className="text-xs text-center text-slate-400 mt-3">
                  Applications close soon
                </p>
              </Card>

              <Card className="p-6 bg-white border-slate-200 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Innovator</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    I
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Innovator Name</p>
                    <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 border border-green-100">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
