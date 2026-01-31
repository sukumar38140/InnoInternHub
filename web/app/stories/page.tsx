import { Navbar } from "@/components/shared/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StoriesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Real stories from students and innovators who built amazing things together.
                        </p>
                    </div>

                    {/* Empty State */}
                    <Card className="p-20 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">No Stories Yet</h2>
                        <p className="text-slate-600 max-w-md mx-auto mb-8">
                            Success stories will appear here once projects are completed.
                            Be the first to create a success story on InnoInternHUB!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/explore">
                                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                    Explore Projects <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/auth/register?role=innovator">
                                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                    Post an Idea
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
