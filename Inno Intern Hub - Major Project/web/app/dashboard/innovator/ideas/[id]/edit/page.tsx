"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Sparkles, X, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth, withAuth } from "@/lib/auth-context";
import { projectsApi, type Project } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const domains = [
    "Technology", "Healthcare", "FinTech", "EdTech", "E-commerce",
    "AI/ML", "Blockchain", "IoT", "Sustainability", "Social Impact",
    "Media", "Gaming", "Other"
];

function EditProjectPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
        const loadProject = async () => {
            try {
                const project = await projectsApi.get(id);
                setTitle(project.title);
                setDescription(project.description);
                setShortDescription(project.shortDescription || "");
                setDomain(project.domain);
                setSkills(project.skills);
                setDifficulty(project.difficulty);
                setTeamSize(project.teamSize);
                setDuration(project.duration);
                setCommitment(project.commitment);
                setIsPaid(project.isPaid);
                setStipend(project.stipend);
                if (project.applicationDeadline) {
                    setDeadline(new Date(project.applicationDeadline).toISOString().split("T")[0]);
                }
            } catch (error) {
                console.error("Failed to load project:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadProject();
        }
    }, [id]);

    const handleAddSkill = () => {
        if (newSkill && !skills.includes(newSkill) && skills.length < 10) {
            setSkills([...skills, newSkill]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await projectsApi.update(id, {
                title,
                description,
                shortDescription: shortDescription || undefined,
                domain,
                skills,
                difficulty: difficulty as any,
                teamSize,
                duration,
                commitment: commitment as any,
                isPaid,
                stipend: isPaid ? stipend : undefined,
                applicationDeadline: deadline ? new Date(deadline).toISOString() : undefined,
            });
            router.push("/dashboard/innovator?updated=true");
        } catch (error) {
            console.error("Failed to update project:", error);
            alert("Failed to update project. Please verify that title is at least 5 chars and description at least 50 chars.");
        } finally {
            setIsSaving(false);
        }
    };

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
                <Link href="/dashboard/innovator" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-2">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Project</h1>
                <p className="text-slate-500">Update your project idea details</p>
            </div>

            <form onSubmit={handleSave} className="grid lg:grid-cols-3 gap-8">
                {/* Form Main */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-white border-slate-200 space-y-5">
                        <h2 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" /> Project Details
                        </h2>
                        <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="shortDesc">Short Description</Label>
                            <Input id="shortDesc" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} maxLength={200} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="min-h-[200px]" maxLength={5000} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="domain">Domain</Label>
                            <select id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm" required>
                                <option value="">Select Domain</option>
                                {domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </Card>

                    {/* Required Skills */}
                    <Card className="p-6 bg-white border-slate-200 space-y-4">
                        <Label>Required Skills</Label>
                        <div className="flex gap-2">
                            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())} />
                            <Button type="button" variant="outline" onClick={handleAddSkill}><Plus className="w-4 h-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map((skill, index) => (
                                <Badge key={index} className="bg-blue-50 text-blue-700 hover:bg-blue-100 py-1 px-3">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(index)} className="ml-2 hover:text-blue-900">×</button>
                                </Badge>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Form Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 bg-white border-slate-200 space-y-4">
                        <h3 className="font-semibold text-slate-900 mb-2">Settings</h3>
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Team Size</Label>
                            <Input type="number" value={teamSize} onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={10} />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (weeks)</Label>
                            <Input type="number" value={duration} onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={52} />
                        </div>
                        <div className="space-y-2">
                            <Label>Commitment</Label>
                            <select value={commitment} onChange={(e) => setCommitment(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm">
                                <option value="Part-time">Part-time</option>
                                <option value="Full-time">Full-time</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Deadline</Label>
                            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                        </div>
                    </Card>

                    <Card className="p-6 bg-white border-slate-200 space-y-4">
                        <Label className="flex items-center gap-2">
                            <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                            This is a paid internship
                        </Label>
                        {isPaid && (
                            <div className="space-y-2 mt-2">
                                <Label>Stipend (₹)</Label>
                                <Input type="number" value={stipend || ""} onChange={(e) => setStipend(parseInt(e.target.value) || undefined)} placeholder="10000" min={0} />
                            </div>
                        )}
                    </Card>

                    <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow" disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Updates
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default withAuth(EditProjectPage, ["INNOVATOR"]);
