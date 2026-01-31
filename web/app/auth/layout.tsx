import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Branding Panel */}
            <div className="hidden lg:flex flex-col justify-between bg-slate-900 relative p-10 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-slate-900 to-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                        <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-xl font-bold">
                        InnoIntern<span className="text-blue-400">HUB</span>
                    </span>
                </div>

                <div className="relative z-10 space-y-6 max-w-md">
                    <h2 className="text-4xl font-bold tracking-tight leading-tight">
                        Where Bold Ideas Meet Ambitious Builders
                    </h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                        Join 10,000+ innovators and students who are building the future together.
                        Post ideas, find talent, and launch startups.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-2">
                            {["PS", "AT", "ML", "JD"].map((initials, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold"
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400">
                            <span className="text-white font-semibold">500+</span> projects completed this month
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-6">
                    <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                    </Link>
                    <span className="text-sm text-slate-600">© 2026 InnoInternHUB</span>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-col bg-white relative">
                <div className="lg:hidden p-6 absolute top-0 left-0 z-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">InnoInternHUB</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md space-y-8 mt-16 lg:mt-0">
                        {children}
                    </div>
                </div>

                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
