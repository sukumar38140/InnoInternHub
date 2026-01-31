import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Calendar, Award, User, Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";

// This would be a server component that fetches data
// For now, showing the UI structure

interface VerifyPageProps {
    params: Promise<{ certificateNo: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
    const { certificateNo } = await params;

    // In production, this would fetch from the API:
    // const verification = await certificatesApi.verify(certificateNo);

    // Mock verification result for UI demonstration
    const verification = {
        valid: false,
        message: "Certificate not found",
        certificate: null as null | {
            certificateNo: string;
            studentName: string;
            projectTitle: string;
            innovatorName: string;
            skills: string[];
            startDate: string;
            endDate: string;
            issuedAt: string;
            domain: string;
        },
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-2xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <Card className="p-8 bg-white border-slate-200 shadow-sm">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate Verification</h1>
                            <p className="text-slate-500">
                                Certificate ID: <span className="font-mono text-slate-700">{certificateNo}</span>
                            </p>
                        </div>

                        {verification.valid && verification.certificate ? (
                            <div className="space-y-6">
                                {/* Valid Certificate */}
                                <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                    <div>
                                        <p className="font-bold text-green-700">Valid Certificate</p>
                                        <p className="text-sm text-green-600">This certificate is authentic and verified</p>
                                    </div>
                                </div>

                                {/* Certificate Details */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-500">Awarded To</p>
                                            <p className="font-semibold text-slate-900">{verification.certificate.studentName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-500">Project</p>
                                            <p className="font-semibold text-slate-900">{verification.certificate.projectTitle}</p>
                                            <p className="text-sm text-slate-500">by {verification.certificate.innovatorName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-500">Duration</p>
                                            <p className="font-semibold text-slate-900">
                                                {new Date(verification.certificate.startDate).toLocaleDateString()} - {new Date(verification.certificate.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Award className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-slate-500">Skills</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {verification.certificate.skills.map((skill, i) => (
                                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center pt-4 border-t border-slate-100">
                                    <p className="text-xs text-slate-400">
                                        Issued on {new Date(verification.certificate.issuedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Invalid/Not Found Certificate */}
                                <div className="flex items-center justify-center gap-3 p-6 bg-red-50 border border-red-200 rounded-xl">
                                    <XCircle className="w-10 h-10 text-red-500" />
                                    <div>
                                        <p className="font-bold text-red-700">Certificate Not Found</p>
                                        <p className="text-sm text-red-600">{verification.message}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-700">
                                        <p className="font-medium mb-1">What does this mean?</p>
                                        <ul className="list-disc list-inside space-y-1 text-amber-600">
                                            <li>The certificate ID may be incorrect</li>
                                            <li>The certificate may have been revoked</li>
                                            <li>The certificate may not exist in our system</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-slate-500 mb-4">
                                        If you believe this is an error, please contact our support team.
                                    </p>
                                    <Link href="/contact">
                                        <Button variant="outline" className="gap-2">
                                            Contact Support
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400">
                            InnoInternHUB certificates are digitally verified and tamper-proof.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
