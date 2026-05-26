"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Lightbulb,
    Search,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    Briefcase,
    PieChart,
    Users,
    Award,
    Bell,
    Plus,
    Folder,
    Activity,
    Loader2,
} from "lucide-react";
import { useAuth, getUserInitials, getUserFullName, UserRole } from "@/lib/auth-context";

// =============================================================================
// ROLE CONFIGURATION - Navigation links per role
// =============================================================================

const roleConfig: Record<string, {
    color: string;
    bgColor: string;
    textColor: string;
    links: Array<{ href: string; label: string; icon: React.ComponentType<any> }>
}> = {
    STUDENT: {
        color: "blue",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        links: [
            { href: "/explore", label: "Find Internships", icon: Search },
            { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/student/applications", label: "My Applications", icon: Briefcase },
            { href: "/dashboard/student/portfolio", label: "Portfolio", icon: Folder },
            { href: "/dashboard/student/certificates", label: "Certificates", icon: Award },
        ],
    },
    INNOVATOR: {
        color: "purple",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        links: [
            { href: "/dashboard/innovator", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/innovator/post", label: "Post New Idea", icon: Plus },
            { href: "/dashboard/innovator/ideas", label: "My Ideas", icon: Lightbulb },
            { href: "/dashboard/innovator/applicants", label: "Applicants", icon: Users },
        ],
    },
    INVESTOR: {
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        links: [
            { href: "/dashboard/investor", label: "Dashboard", icon: LayoutDashboard },
            { href: "/explore", label: "Scout Talent", icon: Search },
            { href: "/dashboard/investor/portfolio", label: "My Portfolio", icon: PieChart },
            { href: "/dashboard/investor/watchlist", label: "Watchlist", icon: Lightbulb },
        ],
    },
    ADMIN: {
        color: "red",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        links: [
            { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
            { href: "/dashboard/admin/projects", label: "Moderate Projects", icon: Briefcase },
            { href: "/dashboard/admin/certificates", label: "Certificates", icon: Award },
            { href: "/dashboard/admin/analytics", label: "Analytics", icon: Activity },
        ],
    },
};

const commonLinks = [
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout, isAuthenticated } = useAuth();

    // ---------------------------------------------------------------------------
    // Loading state
    // ---------------------------------------------------------------------------
    if (isLoading) {
        return (
            <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen fixed left-0 top-0 z-40">
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // Not authenticated - show minimal sidebar
    // ---------------------------------------------------------------------------
    if (!isAuthenticated || !user) {
        return (
            <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen fixed left-0 top-0 z-40">
                <div className="p-5 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">
                            InnoIntern<span className="text-blue-600">HUB</span>
                        </span>
                    </Link>
                </div>
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div>
                        <p className="text-slate-500 mb-4">Please sign in to access your dashboard</p>
                        <Link href="/auth/login">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Sign In
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // Get config based on user's ACTUAL role from database
    // ---------------------------------------------------------------------------
    const userRole = user.role;
    const config = roleConfig[userRole] || roleConfig.STUDENT;
    const links = [...config.links, ...commonLinks];

    // ---------------------------------------------------------------------------
    // Handle logout
    // ---------------------------------------------------------------------------
    const handleLogout = async () => {
        await logout();
    };

    // ---------------------------------------------------------------------------
    // Render authenticated sidebar
    // ---------------------------------------------------------------------------
    return (
        <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="p-5 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">
                        InnoIntern<span className="text-blue-600">HUB</span>
                    </span>
                </Link>
            </div>

            {/* Role Indicator - Shows ACTUAL user role */}
            <div className="px-4 py-3">
                <div className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium capitalize",
                    config.bgColor,
                    config.textColor
                )}>
                    {userRole.toLowerCase()} Dashboard
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section - Shows ACTUAL user data */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-3 px-2">
                    {/* Avatar with user initials */}
                    <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                        userRole === "STUDENT" && "bg-gradient-to-br from-blue-400 to-blue-600 text-white",
                        userRole === "INNOVATOR" && "bg-gradient-to-br from-purple-400 to-purple-600 text-white",
                        userRole === "INVESTOR" && "bg-gradient-to-br from-green-400 to-green-600 text-white",
                        userRole === "ADMIN" && "bg-gradient-to-br from-red-400 to-red-600 text-white",
                    )}>
                        {getUserInitials(user)}
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Actual user name */}
                        <p className="text-sm font-medium text-slate-900 truncate">
                            {getUserFullName(user)}
                        </p>
                        {/* Actual user email */}
                        <p className="text-xs text-slate-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
