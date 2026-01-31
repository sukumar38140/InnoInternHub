"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Plus,
    X,
    DollarSign,
    Clock,
    Users,
    Sparkles,
    Save,
    Send
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const domains = [
    "Technology", "Healthcare", "FinTech", "EdTech", "E-commerce",
    "AI/ML", "Blockchain", "IoT", "Sustainability", "Social Impact",
    "Media", "Gaming", "Other"
];

const skillSuggestions = [
    "React", "Next.js", "Node.js", "Python", "Machine Learning",
    "UI/UX Design", "Data Analysis", "Marketing", "Content Writing",
    "Mobile Development", "DevOps", "Database", "API Development"
];

export default function PostProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [domain, setDomain] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [teamSize, setTeamSize] = useState(1);
    const [duration, setDuration] = useState(4);
    const [commitment, setCommitment] = useState("Part-time");
    const [isPaid, setIsPaid] = useState(false);
    const [stipend, setStipend] = useState<number | undefined>();
    const [deadline, setDeadline] = useState("");
    const [milestones, setMilestones] = useState<Array<{ title: string; description: string }>>([
        { title: "", description: "" }
    ]);

    const handleAddSkill = (skill: string) => {
        if (skill && !skills.includes(skill) && skills.length < 10) {
            setSkills([...skills, skill]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleAddMilestone = () => {
        if (milestones.length < 10) {
            setMilestones([...milestones, { title: "", description: "" }]);
        }
    };

    const handleRemoveMilestone = (index: number) => {
        setMilestones(milestones.filter((_, i) => i !== index));
    };

    const handleMilestoneChange = (index: number, field: string, value: string) => {
        const updated = [...milestones];
        updated[index] = { ...updated[index], [field]: value };
        setMilestones(updated);
    };

    const { user } = useAuth(); // Import useAuth hook

    const handleSubmit = async (publish: boolean) => {
        if (!user) return; // Should be handled by protected route, but safety check

        setIsSubmitting(true);

        try {
            // Import dynamically to assume client-side execution or just rely on 'use client'
            const { storage } = await import("@/lib/storage");

            storage.createProject({
                innovatorId: user.id,
                title,
                description,
                shortDescription,
                domain,
                skills,
                difficulty,
                teamSize,
                duration,
                commitment,
                isPaid,
                stipend,
                applicationDeadline: deadline,
                milestones: milestones.filter(m => m.title),
                status: publish ? "PUBLISHED" : "DRAFT",
            });

            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate net lag
            router.push("/dashboard/innovator?posted=true");
        } catch (error) {
            console.error("Failed to create project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dashboard/innovator" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-2">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Post a New Project</h1>
                    <p className="text-slate-500">Create an internship opportunity for students</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card className="p-6 bg-white border-slate-200 space-y-5">
                        <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" /> Basic Information
                        </h2>

                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Build an AI-Powered Recommendation System"
                                maxLength={100}
                            />
                            <p className="text-xs text-slate-500">{title.length}/100</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="shortDesc">Short Description</Label>
                            <Input
                                id="shortDesc"
                                value={shortDescription}
                                onChange={(e) => setShortDescription(e.target.value)}
                                placeholder="A brief one-liner about your project"
                                maxLength={200}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project in detail. Include goals, expectations, and what students will learn..."
                                className="min-h-[200px]"
                                maxLength={5000}
                            />
                            <p className="text-xs text-slate-500">{description.length}/5000 (minimum 50)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="domain">Domain <span className="text-red-500">*</span></Label>
                            <select
                                id="domain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                            >
                                <option value="">Select a domain</option>
                                {domains.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </Card>

                    {/* Skills */}
                    <Card className="p-6 bg-white border-slate-200 space-y-4">
                        <h2 className="font-semibold text-lg text-slate-900">Required Skills</h2>

                        <div className="flex gap-2">
                            <Input
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill"
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill(newSkill))}
                            />
                            <Button type="button" variant="outline" onClick={() => handleAddSkill(newSkill)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full">
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(i)}
                                            className="hover:text-blue-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-slate-500 mb-2">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                                {skillSuggestions
                                    .filter(s => !skills.includes(s))
                                    .slice(0, 6)
                                    .map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => handleAddSkill(skill)}
                                            className="px-2 py-1 text-xs border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50"
                                        >
                                            + {skill}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </Card>

                    {/* Milestones */}
                    <Card className="p-6 bg-white border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg text-slate-900">Project Milestones</h2>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddMilestone}
                                disabled={milestones.length >= 10}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Add Milestone
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {milestones.map((milestone, i) => (
                                <div key={i} className="p-4 bg-slate-50 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-600">Milestone {i + 1}</span>
                                        {milestones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMilestone(i)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <Input
                                        value={milestone.title}
                                        onChange={(e) => handleMilestoneChange(i, "title", e.target.value)}
                                        placeholder="Milestone title"
                                    />
                                    <Textarea
                                        value={milestone.description}
                                        onChange={(e) => handleMilestoneChange(i, "description", e.target.value)}
                                        placeholder="What should be delivered?"
                                        className="min-h-[80px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Project Details */}
                    <Card className="p-6 bg-white border-slate-200 space-y-5">
                        <h2 className="font-semibold text-lg text-slate-900">Project Details</h2>

                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> Team Size
                            </Label>
                            <Input
                                type="number"
                                value={teamSize}
                                onChange={(e) => setTeamSize(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                                min={1}
                                max={10}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Duration (weeks)
                            </Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                                min={1}
                                max={52}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Commitment</Label>
                            <select
                                value={commitment}
                                onChange={(e) => setCommitment(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                            >
                                <option value="Part-time">Part-time</option>
                                <option value="Full-time">Full-time</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Application Deadline</Label>
                            <Input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>
                    </Card>

                    {/* Compensation */}
                    <Card className="p-6 bg-white border-slate-200 space-y-5">
                        <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" /> Compensation
                        </h2>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPaid}
                                    onChange={(e) => setIsPaid(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                            <span className="text-sm text-slate-700">This is a paid internship</span>
                        </div>

                        {isPaid && (
                            <div className="space-y-2">
                                <Label>Monthly Stipend (₹)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        type="number"
                                        value={stipend || ""}
                                        onChange={(e) => setStipend(parseInt(e.target.value) || undefined)}
                                        placeholder="10000"
                                        className="pl-9"
                                        min={0}
                                        max={100000}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Actions */}
                    <Card className="p-6 bg-white border-slate-200 space-y-3">
                        <Button
                            onClick={() => handleSubmit(true)}
                            className="w-full gap-2"
                            disabled={isSubmitting || !title || !description || !domain || skills.length === 0}
                        >
                            {isSubmitting ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Publish Project
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleSubmit(false)}
                            className="w-full gap-2"
                            disabled={isSubmitting}
                        >
                            <Save className="w-4 h-4" /> Save as Draft
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
