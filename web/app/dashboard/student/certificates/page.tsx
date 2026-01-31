import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Award,
    Download,
    ExternalLink,
    Calendar,
    CheckCircle2,
    Share2
} from "lucide-react";
import Link from "next/link";

// Student Certificates Page
export default function StudentCertificatesPage() {
    // In production, fetch from API
    const certificates: any[] = [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Certificates</h1>
                <p className="text-slate-500">Download and share your verified internship certificates</p>
            </div>

            {/* Certificates Grid */}
            {certificates.length === 0 ? (
                <Card className="p-16 bg-white border-slate-200 text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center mb-6">
                        <Award className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3">No certificates yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                        Complete your first internship project to earn a verified certificate. Certificates are issued once all project milestones are completed.
                    </p>
                    <Link href="/explore">
                        <Button size="lg" className="gap-2">
                            Find Your First Project <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {certificates.map((cert) => (
                        <Card
                            key={cert.id}
                            className="overflow-hidden bg-white border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            {/* Certificate Preview */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 p-6">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white/30 rounded-full" />
                                    <div className="absolute bottom-4 right-4 w-32 h-32 border-4 border-white/30 rounded-full" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Award className="w-4 h-4" />
                                            <span className="text-xs font-medium">Certificate of Completion</span>
                                        </div>
                                        <Badge className="bg-white/20 text-white border-0">
                                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-sm mb-1">Awarded to</p>
                                        <h3 className="text-xl font-bold text-white">{cert.studentName}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Certificate Details */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">{cert.projectTitle}</h4>
                                    <p className="text-sm text-slate-500">by {cert.innovatorName}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {cert.skills.slice(0, 4).map((skill: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {cert.skills.length > 4 && (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-xs">
                                            +{cert.skills.length - 4} more
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Button size="sm" className="flex-1 gap-1.5">
                                        <Download className="w-3.5 h-3.5" /> Download PDF
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Share2 className="w-3.5 h-3.5" /> Share
                                    </Button>
                                    <Link href={`/verify/${cert.certificateNo}`}>
                                        <Button variant="ghost" size="icon" className="shrink-0">
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>
                                </div>

                                <p className="text-xs text-slate-400 text-center">
                                    ID: {cert.certificateNo}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                        <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-1">About InnoInternHUB Certificates</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            All certificates issued by InnoInternHUB are digitally verified and tamper-proof. Each certificate has a unique ID and QR code that can be scanned to verify its authenticity. Share your certificates on LinkedIn, add them to your resume, or download them as PDF.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
