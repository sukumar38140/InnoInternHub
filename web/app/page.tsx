import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Lightbulb, GraduationCap, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full text-sm font-medium border border-blue-100">
                🚀 Now Open for Registration
              </Badge>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
              Where <span className="text-blue-600">Ideas</span> Meet <span className="text-indigo-600">Ambition</span>.
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              The platform for innovators to build teams and students to gain certified experience. Be among the first to join our community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-base rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700">
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 100% Free</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Certificates</span>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Start Your Journey</h3>
                <p className="text-slate-500">Post an idea or find your next opportunity</p>
                <div className="flex gap-3">
                  <div className="p-4 bg-blue-50 rounded-xl text-center flex-1">
                    <Lightbulb className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Post Ideas</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-xl text-center flex-1">
                    <GraduationCap className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Join Projects</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center flex-1">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">Invest</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10" />
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10" />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">One Platform, Three Ecosystems</h2>
          <p className="text-slate-600 text-lg">Whether you have an idea, a skill, or capital—there&apos;s a place for you here.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1 bg-white group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Innovators</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">Turn concepts into prototypes. Hire student talent efficiently and retain your IP.</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Secure IP Contracts</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Milestone-based Management</li>
            </ul>
            <Link href="/auth/register?role=innovator">
              <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">Post Idea</Button>
            </Link>
          </Card>

          <Card className="p-8 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-xl hover:-translate-y-1 bg-white group">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Students</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">Don&apos;t just study—build. Gain verified experience and earn money while studying.</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Real Project Portfolio</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Verified Certificates</li>
            </ul>
            <Link href="/auth/register?role=student">
              <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">Join Projects</Button>
            </Link>
          </Card>

          <Card className="p-8 border border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl hover:-translate-y-1 bg-white group">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Investors</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">Discover validated startups early. Access the Hall of Fame of completed projects.</p>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-600" /> Exclusive Deal Flow</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-600" /> Talent Reports</li>
            </ul>
            <Link href="/auth/register?role=investor">
              <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">Scout Talent</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Early Adopter Benefits</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Be Among the First</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join now and be part of building the future of innovation internships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-8 bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-14 px-8 bg-white text-blue-600 border-white hover:bg-blue-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
