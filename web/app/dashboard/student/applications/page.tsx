import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ExternalLink,
    MessageSquare
} from "lucide-react";
import Link from "next/link";

// Student Applications Page
export default function StudentApplicationsPage() {
    // In production, fetch from API
    const applications: any[] = [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
            case "SHORTLISTED":
                return <Badge className="bg-blue-100 text-blue-700">Shortlisted</Badge>;
            case "ACCEPTED":
                return <Badge className="bg-green-100 text-green-700">Accepted</Badge>;
            case "REJECTED":
                return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
            case "WITHDRAWN":
                return <Badge className="bg-slate-100 text-slate-600">Withdrawn</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "REJECTED":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "PENDING":
            case "SHORTLISTED":
                return <AlertCircle className="w-5 h-5 text-amber-500" />;
            default:
                return <Clock className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Applications</h1>
                <p className="text-slate-500">Track the status of your project applications</p>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
                <Card className="p-16 bg-white border-slate-200 text-center">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Briefcase className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">No applications yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        You haven&apos;t applied to any projects yet. Start exploring opportunities and submit your first application!
                    </p>
                    <Link href="/explore">
                        <Button size="lg">Explore Projects</Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="p-6 bg-white border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl">
                                    {getStatusIcon(app.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900 mb-1">{app.project?.title}</h3>
                                            <p className="text-sm text-slate-500 mb-2">
                                                by {app.project?.innovator?.firstName} {app.project?.innovator?.lastName}
                                                {app.project?.innovator?.companyName && ` • ${app.project.innovator.companyName}`}
                                            </p>
                                        </div>
                                        {getStatusBadge(app.status)}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        {app.project?.stipend && (
                                            <span className="text-green-600 font-medium">₹{app.project.stipend.toLocaleString()}/mo</span>
                                        )}
                                    </div>

                                    {app.feedback && (
                                        <div className="p-3 bg-slate-50 rounded-lg mb-4">
                                            <p className="text-sm text-slate-600">
                                                <strong>Feedback:</strong> {app.feedback}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Link href={`/explore/${app.projectId}`}>
                                            <Button variant="outline" size="sm" className="gap-1.5">
                                                <ExternalLink className="w-3.5 h-3.5" /> View Project
                                            </Button>
                                        </Link>
                                        {app.status === "ACCEPTED" && (
                                            <Link href="/dashboard/messages">
                                                <Button size="sm" className="gap-1.5">
                                                    <MessageSquare className="w-3.5 h-3.5" /> Message Innovator
                                                </Button>
                                            </Link>
                                        )}
                                        {app.status === "PENDING" && (
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                Withdraw Application
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
