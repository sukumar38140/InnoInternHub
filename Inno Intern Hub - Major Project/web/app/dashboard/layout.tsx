import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen">
                <div className="flex-1 p-8">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}
