"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth, withAuth, getUserInitials } from "@/lib/auth-context";
import { Loader2, Save, Plus, X, User as UserIcon, Mail, MapPin, Globe, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

function StudentPortfolio() {
    const { user, isLoading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        bio: user?.bio || "",
        education: user?.education || "",
        university: user?.university || "",
        graduationYear: user?.graduationYear?.toString() || "",
        skills: user?.skills || [],
        portfolioUrl: user?.portfolioUrl || "",
        location: "New York, USA", // Mock location for now
    });
    const [newSkill, setNewSkill] = useState("");

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In production: await userApi.updateProfile(formData);
        setIsSaving(false);
        setIsEditing(false);
    };

    const addSkill = () => {
        if (newSkill && !formData.skills.includes(newSkill)) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill]
            }));
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Portfolio</h1>
                    <p className="text-slate-500 mt-1">Manage your public profile and skills</p>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Header Card */}
            <Card className="p-6 md:p-8 bg-white border-slate-200">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {getUserInitials(user)}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {user?.firstName} {user?.lastName}
                        </h2>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4" /> {user?.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" /> {formData.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4" /> {user?.level || "Aspiring Innovator"}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Bio Section */}
                    <Card className="p-6 bg-white border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                            <UserIcon className="w-5 h-5 text-blue-600" /> About Me
                        </h3>
                        {isEditing ? (
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                className="min-h-[150px]"
                            />
                        ) : (
                            <p className="text-slate-600 leading-relaxed">
                                {formData.bio || "No bio added yet. Click edit to tell your story!"}
                            </p>
                        )}
                    </Card>

                    {/* Education Section */}
                    <Card className="p-6 bg-white border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" /> Education
                        </h3>
                        <div className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>University / School</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.university}
                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                            placeholder="e.g. Stanford University"
                                        />
                                    ) : (
                                        <p className="text-slate-900 font-medium">{formData.university || "Not specified"}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Degree / Major</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.education}
                                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                                placeholder="e.g. Computer Science"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{formData.education || "Not specified"}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Graduation Year</Label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.graduationYear}
                                                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                                                placeholder="e.g. 2025"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{formData.graduationYear || "Not specified"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                    {/* Skills Section */}
                    <Card className="p-6 bg-white border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                            <Badge className="w-5 h-5 bg-blue-100 text-blue-600 hover:bg-blue-100 p-0 flex items-center justify-center rounded-full">★</Badge>
                            Skills
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    {skill}
                                    {isEditing && (
                                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-blue-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </Badge>
                            ))}
                            {formData.skills.length === 0 && !isEditing && (
                                <p className="text-sm text-slate-500">No skills listed yet</p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add skill..."
                                    className="h-9"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                />
                                <Button size="sm" onClick={addSkill} type="button">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Links Section */}
                    <Card className="p-6 bg-white border-slate-200">
                        <h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" /> Social Links
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Portfolio / Website</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.portfolioUrl}
                                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                        placeholder="https://..."
                                    />
                                ) : (
                                    formData.portfolioUrl ? (
                                        <a href={formData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block truncate">
                                            {formData.portfolioUrl}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-500">Not specified</p>
                                    )
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withAuth(StudentPortfolio, ["STUDENT"]);
