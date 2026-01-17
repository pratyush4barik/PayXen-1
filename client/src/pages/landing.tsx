import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SplineHero } from "@/components/spline-hero";
import { Ghost, Shield, Zap, CreditCard, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ghost className="w-6 h-6 text-fuchsia-500" />
            <span className="text-2xl font-bold font-display tracking-tight">SubX</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-fuchsia-400">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-fuchsia-300">
              <span className="flex h-2 w-2 rounded-full bg-fuchsia-500 mr-2 animate-pulse"></span>
              The Ghost Agent is live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Master your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">subscriptions.</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Stop paying for services you don't use. Our AI "Ghost Agent" monitors, tracks, and manages your digital life automatically.
            </p>
            
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-lg shadow-lg shadow-fuchsia-600/30 transition-all hover:scale-105">
                  Start Free Trial <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/10 text-lg backdrop-blur-sm">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="h-[500px] w-full relative">
             <SplineHero />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-zinc-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-bold mb-4">Features that feel like magic</h2>
            <p className="text-gray-400">Everything you need to regain control of your monthly recurring revenue.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-400 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                <Ghost className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ghost Agent</h3>
              <p className="text-gray-400">Our automated agent detects unused subscriptions and cancels them for you (with permission).</p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 text-fuchsia-400 group-hover:bg-fuchsia-500 group-hover:text-white transition-colors">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Analytics</h3>
              <p className="text-gray-400">Visualize your spending habits with beautiful, interactive charts and real-time data.</p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Wallet</h3>
              <p className="text-gray-400">Manage payment methods securely. We use bank-grade encryption for all your financial data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Mock */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-violet-900/50 to-fuchsia-900/50 rounded-[40px] p-12 md:p-24 text-center border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             
             <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 relative z-10">Ready to stop wasting money?</h2>
             <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">Join 10,000+ users saving an average of $340/year with SubX.</p>
             
             <Link href="/register">
               <Button size="lg" className="h-16 px-10 text-xl rounded-full bg-white text-black hover:bg-gray-100 font-bold shadow-2xl hover:scale-105 transition-transform relative z-10">
                 Get Started for Free
               </Button>
             </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-black border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2025 SubX Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
