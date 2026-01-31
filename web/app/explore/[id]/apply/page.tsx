"use client";

import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Plus, X, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [coverLetter, setCoverLetter] = useState("");
    const [experience, setExperience] = useState("");
    const [availability, setAvailability] = useState("");
    const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
    const [newLink, setNewLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddLink = () => {
        if (newLink && portfolioLinks.length < 5) {
            setPortfolioLinks([...portfolioLinks, newLink]);
            setNewLink("");
        }
    };

    const handleRemoveLink = (index: number) => {
        setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // In production:
            // await applicationsApi.apply(projectId, {
            //   coverLetter,
            //   relevantExperience: experience,
            //   availability,
            //   portfolioLinks,
            // });

            // Simulate submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push("/dashboard/student/applications?success=true");
        } catch (error) {
            console.error("Failed to submit application:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-2xl mx-auto px-6">
                    <Link href={`/explore/${projectId}`} className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
                    </Link>

                    <Card className="p-8 bg-white border-slate-200">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Apply for this Project</h1>
                            <p className="text-slate-500">
                                Fill in your application details below. Make sure to highlight your relevant skills and experience.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Cover Letter */}
                            <div className="space-y-2">
                                <Label htmlFor="coverLetter">
                                    Cover Letter <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="coverLetter"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Explain why you're interested in this project and what makes you a great fit..."
                                    className="min-h-[200px]"
                                    required
                                    minLength={50}
                                    maxLength={2000}
                                />
                                <p className="text-xs text-slate-500">
                                    {coverLetter.length}/2000 characters (minimum 50)
                                </p>
                            </div>

                            {/* Relevant Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="experience">Relevant Experience</Label>
                                <Textarea
                                    id="experience"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    placeholder="Describe any relevant projects, coursework, or experience..."
                                    className="min-h-[120px]"
                                    maxLength={1000}
                                />
                            </div>

                            {/* Availability */}
                            <div className="space-y-2">
                                <Label htmlFor="availability">Availability</Label>
                                <Input
                                    id="availability"
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    placeholder="e.g., 20 hours/week, available immediately"
                                    maxLength={200}
                                />
                            </div>

                            {/* Portfolio Links */}
                            <div className="space-y-3">
                                <Label>Portfolio Links</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={newLink}
                                            onChange={(e) => setNewLink(e.target.value)}
                                            placeholder="https://github.com/yourusername"
                                            className="pl-9"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleAddLink}
                                        disabled={portfolioLinks.length >= 5}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                {portfolioLinks.length > 0 && (
                                    <div className="space-y-2">
                                        {portfolioLinks.map((link, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                                                <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="text-sm text-slate-600 flex-1 truncate">{link}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 h-6 w-6"
                                                    onClick={() => handleRemoveLink(index)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">
                                    Add up to 5 links to your portfolio, GitHub, LinkedIn, etc.
                                </p>
                            </div>

                            {/* Submit */}
                            <div className="pt-4 border-t border-slate-100">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full gap-2"
                                    disabled={isSubmitting || coverLetter.length < 50}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Submit Application
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-center text-slate-500 mt-3">
                                    By submitting, you agree to our terms and conditions.
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
