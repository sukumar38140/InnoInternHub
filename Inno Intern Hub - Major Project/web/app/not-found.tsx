
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/footer";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="space-y-6 max-w-md mx-auto">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-4xl font-bold text-blue-600">404</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
                    <p className="text-slate-500">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                    </p>
                    <div className="pt-4">
                        <Link href="/">
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
