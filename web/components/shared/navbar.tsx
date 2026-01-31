"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/about", label: "How it Works" },
    { href: "/stories", label: "Success Stories" },
    { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        InnoIntern<span className="text-blue-600">HUB</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "text-blue-600"
                                    : "text-slate-600 hover:text-blue-600"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
                        <Link href="/auth/login" className="block">
                            <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                        <Link href="/auth/register" className="block">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
