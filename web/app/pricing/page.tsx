import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Student",
        price: "Free",
        description: "Perfect for students looking for real project experience",
        features: [
            "Unlimited project applications",
            "Portfolio builder",
            "Verified certificates",
            "Skill assessments",
            "Chat with innovators",
        ],
        cta: "Get Started Free",
        href: "/auth/register?role=student",
        highlight: false,
    },
    {
        name: "Innovator",
        price: "Free",
        description: "For innovators who want to build their dream team",
        features: [
            "Post unlimited ideas",
            "Access to all applicants",
            "Milestone management",
            "Team collaboration tools",
            "IP protection agreements",
            "Priority support",
        ],
        cta: "Start Posting",
        href: "/auth/register?role=innovator",
        highlight: true,
    },
    {
        name: "Investor",
        price: "Free",
        description: "Access to the Hall of Fame and talent pipeline",
        features: [
            "View completed projects",
            "Talent scouting",
            "Project analytics",
            "Direct intros to teams",
            "Early deal flow access",
        ],
        cta: "Join as Investor",
        href: "/auth/register?role=investor",
        highlight: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" /> 100% Free During Beta
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            InnoInternHUB is completely free during our beta period. Join now and lock in early adopter benefits!
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`p-8 border-2 ${plan.highlight ? 'border-blue-500 shadow-xl relative' : 'border-slate-200'}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                    <div className="mt-2">
                                        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                        {plan.price !== "Free" && <span className="text-slate-500">/month</span>}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link href={plan.href}>
                                    <Button
                                        className={`w-full h-12 ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                                    >
                                        {plan.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions?</h2>
                        <p className="text-slate-600">
                            Contact us at <a href="mailto:hello@innointernhub.com" className="text-blue-600 hover:underline">hello@innointernhub.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
