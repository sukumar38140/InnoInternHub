import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, Award, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        step: 1,
        title: "For Innovators",
        subtitle: "Share Your Vision",
        description: "Post your innovative idea with clear requirements, team size, and stipend details. Our platform protects your IP while connecting you with top talent.",
        icon: Lightbulb,
        color: "blue",
        features: [
            "Post ideas securely with IP protection",
            "Define milestones and payment terms",
            "Review and select from qualified applicants",
        ],
    },
    {
        step: 2,
        title: "For Students",
        subtitle: "Build & Learn",
        description: "Browse real-world projects that match your skills. Apply, get selected, and gain hands-on experience while earning stipends and building your portfolio.",
        icon: Users,
        color: "indigo",
        features: [
            "Apply to projects matching your skills",
            "Work with mentors on real solutions",
            "Earn money while you learn",
        ],
    },
    {
        step: 3,
        title: "For Everyone",
        subtitle: "Get Certified & Grow",
        description: "Complete projects successfully to earn verified certificates. Build your reputation, unlock new opportunities, and watch your career take off.",
        icon: Award,
        color: "purple",
        features: [
            "Earn verified completion certificates",
            "Build a strong professional portfolio",
            "Get noticed by investors and employers",
        ],
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">How InnoInternHUB Works</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            A simple, transparent process that connects innovative ideas with talented students.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-12">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <Card key={step.step} className="p-8 border-slate-200 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className={`p-4 rounded-2xl bg-${step.color}-50 shrink-0`}>
                                            <Icon className={`w-8 h-8 text-${step.color}-600`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-400 mb-1">Step {step.step}</div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h2>
                                            <p className="text-slate-600 mb-4">{step.description}</p>
                                            <ul className="space-y-2">
                                                {step.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-slate-600">
                                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/register?role=student">
                                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                                    Join as Student <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/auth/register?role=innovator">
                                <Button variant="outline" className="h-12 px-8 border-slate-200 text-slate-700 hover:bg-slate-50">
                                    Post an Idea
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
