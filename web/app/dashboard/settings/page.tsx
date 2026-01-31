"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Mail,
    Phone,
    Building,
    Globe,
    Camera,
    Save,
    Bell,
    Lock,
    Trash2
} from "lucide-react";
import { useState } from "react";

// Settings page
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Lock },
        { id: "danger", label: "Danger Zone", icon: Trash2 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account and preferences</p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === "profile" && (
                        <Card className="p-6 bg-white border-slate-200 space-y-6">
                            <h2 className="font-semibold text-lg text-slate-900">Profile Information</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        JD
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50">
                                        <Camera className="w-3.5 h-3.5 text-slate-600" />
                                    </button>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Profile Picture</p>
                                    <p className="text-sm text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input className="pl-9" placeholder="John" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input className="pl-9" placeholder="Doe" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input className="pl-9" type="email" placeholder="john@example.com" disabled />
                                </div>
                                <p className="text-xs text-slate-500">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input className="pl-9" type="tel" placeholder="+1 (555) 123-4567" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Bio</Label>
                                <Textarea
                                    placeholder="Tell us about yourself..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Company/University</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input className="pl-9" placeholder="Organization name" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input className="pl-9" type="url" placeholder="https://..." />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Button className="gap-2">
                                    <Save className="w-4 h-4" /> Save Changes
                                </Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card className="p-6 bg-white border-slate-200 space-y-6">
                            <h2 className="font-semibold text-lg text-slate-900">Notification Preferences</h2>

                            <div className="space-y-4">
                                {[
                                    { label: "Application Updates", description: "When your application status changes" },
                                    { label: "New Messages", description: "When you receive a new message" },
                                    { label: "Project Updates", description: "Updates about projects you are part of" },
                                    { label: "Certificate Issued", description: "When a new certificate is issued" },
                                    { label: "Marketing Emails", description: "News, tips, and product updates" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-slate-900">{item.label}</p>
                                            <p className="text-sm text-slate-500">{item.description}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card className="p-6 bg-white border-slate-200 space-y-6">
                            <h2 className="font-semibold text-lg text-slate-900">Security Settings</h2>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input type="password" placeholder="••••••••" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Button className="gap-2">
                                    <Lock className="w-4 h-4" /> Update Password
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="font-medium text-slate-900 mb-3">Connected Accounts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <span className="text-lg">G</span>
                                            </div>
                                            <span className="font-medium text-slate-900">Google</span>
                                        </div>
                                        <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                in
                                            </div>
                                            <span className="font-medium text-slate-900">LinkedIn</span>
                                        </div>
                                        <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === "danger" && (
                        <Card className="p-6 bg-white border-red-200 space-y-6">
                            <h2 className="font-semibold text-lg text-red-600">Danger Zone</h2>

                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                                <p className="text-sm text-red-600 mb-4">
                                    Once you delete your account, there is no going back. All your data, projects, applications, and certificates will be permanently removed.
                                </p>
                                <Button variant="destructive">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete My Account
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
