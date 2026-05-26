"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    GraduationCap,
    ExternalLink,
    Clock,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useAuth, withAuth } from "@/lib/auth-context";
import { projectsApi, applicationsApi, type Project, type Application } from "@/lib/api";

function ProjectApplicantsPage() {
    const { id: projectId } = useParams() as { id: string };
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [feedback, setFeedback] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const loadData = async () => {
        try {
            const [projData, appsData] = await Promise.all([
                projectsApi.get(projectId),
                applicationsApi.getProjectApplications(projectId)
            ]);
            setProject(projData);
            setApplications(appsData);
            if (appsData.length > 0) {
                setSelectedApp(appsData[0]);
                setFeedback(appsData[0].feedback || "");
            }
        } catch (error) {
            console.error("Failed to load project applicants:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            loadData();
        }
    }, [projectId]);

    const handleSelectApp = (app: Application) => {
        setSelectedApp(app);
        setFeedback(app.feedback || "");
    };

    const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED" | "SHORTLISTED") => {
        if (!selectedApp) return;
        setIsUpdating(true);
        try {
            await applicationsApi.updateStatus(selectedApp.id, {
                status,
                feedback: feedback || undefined
            });
            alert(`Application ${status.toLowerCase()} successfully.`);
            await loadData(); // Reload list
        } catch (error) {
            console.error("Failed to update application status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
                <Link href="/dashboard/innovator">
                    <Button className="mt-4">Back to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard/innovator" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-2">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Applicants for &quot;{project.title}&quot;</h1>
                <p className="text-slate-500">Review student applications and build your team</p>
            </div>

            {applications.length === 0 ? (
                <Card className="p-16 text-center bg-white border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No Applicants Yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Your project is open. When students apply, their portfolios and cover letters will appear here.
                    </p>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left panel: Applicants List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h2 className="font-semibold text-slate-800 text-sm px-1">Candidates ({applications.length})</h2>
                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {applications.map((app) => {
                                const isSelected = selectedApp?.id === app.id;
                                return (
                                    <Card
                                        key={app.id}
                                        className={`p-4 cursor-pointer border transition-all ${
                                            isSelected
                                                ? "border-blue-500 bg-blue-50/50 shadow-sm"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                        onClick={() => handleSelectApp(app)}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 truncate">
                                                    {app.student?.firstName} {app.student?.lastName}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{app.student?.university || "Student"}</p>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={`text-[10px] font-bold ${
                                                    app.status === "ACCEPTED"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : app.status === "REJECTED"
                                                        ? "bg-red-50 text-red-700 border-red-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}
                                            >
                                                {app.status.toLowerCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right panel: Applicant details */}
                    <div className="lg:col-span-2">
                        {selectedApp ? (
                            <Card className="p-6 bg-white border-slate-200 space-y-6">
                                {/* Profile Summary */}
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow">
                                            {selectedApp.student ? `${selectedApp.student.firstName[0]}${selectedApp.student.lastName[0]}`.toUpperCase() : "S"}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">
                                                {selectedApp.student?.firstName} {selectedApp.student?.lastName}
                                            </h2>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedApp.student?.email}</span>
                                                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {selectedApp.student?.university}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 gap-1.5"
                                            onClick={() => handleStatusUpdate("ACCEPTED")}
                                            disabled={isUpdating}
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="gap-1.5"
                                            onClick={() => handleStatusUpdate("REJECTED")}
                                            disabled={isUpdating}
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </Button>
                                    </div>
                                </div>

                                {/* Application cover letter & links */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Cover Letter</h3>
                                        <p className="text-sm text-slate-600 mt-1.5 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                                            {selectedApp.coverLetter || "No cover letter provided."}
                                        </p>
                                    </div>

                                    {selectedApp.relevantExperience && (
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Relevant Experience</h3>
                                            <p className="text-sm text-slate-600 mt-1.5 bg-slate-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">
                                                {selectedApp.relevantExperience}
                                            </p>
                                        </div>
                                    )}

                                    {selectedApp.portfolioLinks && selectedApp.portfolioLinks.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-2">Portfolio / Links</h3>
                                            <div className="flex flex-col gap-2">
                                                {selectedApp.portfolioLinks.map((link, i) => (
                                                    <a
                                                        key={i}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" /> {link}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedApp.student?.skills && selectedApp.student.skills.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-2">Student Skills</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selectedApp.student.skills.map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Review Feedback section */}
                                <div className="space-y-3 pt-6 border-t border-slate-100">
                                    <Label htmlFor="feedback">Evaluation Feedback (optional, visible to student)</Label>
                                    <Textarea
                                        id="feedback"
                                        placeholder="Add notes about your decision or feedback for the student..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        maxLength={500}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleStatusUpdate("SHORTLISTED")}
                                            disabled={isUpdating}
                                        >
                                            Shortlist Candidate
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-16 text-center bg-white border-slate-200">
                                <p className="text-slate-500">Select an applicant to review their details.</p>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(ProjectApplicantsPage, ["INNOVATOR"]);
