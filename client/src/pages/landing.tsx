import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, Wallet, Zap, Menu, X } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.36/build/spline-viewer.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex flex-col font-sans">
      {/* Promo Banner */}
      <div className="bg-primary py-2 px-4 text-center text-primary-foreground text-xs font-bold tracking-wider uppercase">
        Special Offer: Get 20% off yearly plans with code PAYXEN20
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display font-black text-2xl tracking-tighter text-white">
              PAYXEN
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 hidden sm:flex" onClick={() => setLocation("/login")}>
              Sign In
            </Button>
            <Button className="rounded-full px-6 font-bold hover-elevate active-elevate-2" onClick={() => setLocation("/login?mode=register")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero" className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <spline-viewer 
            url="https://prod.spline.design/x2lNa8FmD3MUMtwJ/scene.splinecode"
            className="w-full h-full pointer-events-none"
            loading-anim
          ></spline-viewer>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a] pointer-events-none" />

        <div className="absolute inset-0 flex flex-col items-start justify-center p-6 sm:p-12 lg:p-20 text-left pointer-events-none">
          <div className="pointer-events-auto max-w-4xl w-full">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-black tracking-tighter text-black mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              PAYXEN
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black/70 max-w-xl sm:max-w-2xl font-medium leading-relaxed mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The futuristic way to manage your subscriptions<br />and split costs with absolute precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Button size="lg" className="rounded-full px-8 sm:px-10 h-12 sm:h-14 text-base sm:text-lg font-bold shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover-elevate active-elevate-2 w-full sm:w-auto" onClick={() => setLocation("/login")}>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 sm:px-10 h-12 sm:h-14 text-base sm:text-lg font-bold border-black/10 bg-black/5 text-black backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:bg-black/10 w-full sm:w-auto" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full" id="about">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">Powerful Features</h2>
          <p className="text-white/50 text-lg">Everything you need to regain control of your digital lifestyle.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {/* Feature Cards */}
          <div className="glass-card group p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary glow-primary">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white text-glow">Subscription Tracking</h3>
              <p className="text-white/60 leading-relaxed">
                Automatically detect and monitor all your recurring payments. Get insights into your spending habits with precision.
              </p>
            </div>
          </div>

          <div className="glass-card group p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent glow-accent">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white text-glow">Ghost Cancel</h3>
              <p className="text-white/60 leading-relaxed">
                Never get charged for a trial again. Our intelligent system reminds you to cancel before the deadline hits.
              </p>
            </div>
          </div>

          <div className="glass-card group p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary glow-primary">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white text-glow">Group Wallets</h3>
              <p className="text-white/60 leading-relaxed">
                Effortlessly split costs with family and friends. Manage shared plans like Netflix or Spotify without the awkwardness.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-20" id="pricing">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">Simple Pricing</h2>
          <p className="text-white/50 text-lg">Choose the plan that fits your digital life.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="glass-card group p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white/60 uppercase tracking-widest text-glow">Monthly Protocol</h3>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-5xl font-black font-display text-gradient">$9.99</span>
                  <span className="ml-2 text-xl text-white/40">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary glow-primary">✓</div>
                  Unlimited Subscriptions
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary glow-primary">✓</div>
                  Advanced Usage Analytics
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary glow-primary">✓</div>
                  Ghost Cancel Alerts
                </li>
              </ul>
              <Button className="w-full rounded-xl py-6 font-bold hover-elevate glow-primary bg-white/[0.05] hover:bg-white/[0.1] border-white/10" variant="outline" onClick={() => setLocation("/login?mode=register")}>
                Initialize Monthly
              </Button>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="glass-card group p-10 rounded-3xl border-primary/50 bg-primary/5 relative overflow-hidden shadow-2xl shadow-primary/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg glow-primary z-20">
              Optimized Value
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary uppercase tracking-widest text-glow">Yearly Singularity</h3>
                <div className="mt-4 flex items-baseline text-white">
                  <span className="text-5xl font-black font-display text-gradient">$79.99</span>
                  <span className="ml-2 text-xl text-white/40">/yr</span>
                </div>
                <p className="mt-2 text-primary font-bold text-sm">Save 33% compared to monthly</p>
              </div>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white glow-primary">✓</div>
                  Everything in Monthly
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white glow-primary">✓</div>
                  Priority Power Support
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white glow-primary">✓</div>
                  Exclusive Beta Access
                </li>
              </ul>
              <Button className="w-full rounded-xl py-6 font-bold bg-primary hover:bg-primary/90 hover-elevate glow-primary shadow-xl shadow-primary/20" onClick={() => setLocation("/login?mode=register")}>
                Initialize Yearly
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Section Preview */}
      <section className="py-32 px-6 bg-[#0a0a0a]" id="contact">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          {/* Left Decorative Box */}
          <div className="hidden lg:block w-32 h-32 relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl border border-primary/30 rotate-12 group-hover:rotate-45 transition-all duration-700 ease-in-out blur-sm group-hover:blur-none" />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20 -rotate-12 group-hover:-rotate-45 transition-all duration-700 ease-in-out group-hover:scale-110" />
            <div className="absolute inset-0 flex items-center justify-center text-primary opacity-50 group-hover:opacity-100 transition-opacity">
              <Zap className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left space-y-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 tracking-tighter">
                Get in Touch
              </h2>
              <p className="text-white/50 text-xl max-w-2xl leading-relaxed">
                Ready to take control of your subscriptions? Our futuristic team is here to guide your transition.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-2xl hover:border-primary/50 hover:bg-white/[0.08] transition-all group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-primary glow-primary" /> Support
                </h4>
                <p className="text-white/40 text-sm relative z-10 leading-relaxed">Our AI-assisted support team is available 24/7 for all members.</p>
              </div>
              <div className="glass-card p-6 rounded-2xl hover:border-accent/50 hover:bg-white/[0.08] transition-all group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-accent glow-accent" /> Partnership
                </h4>
                <p className="text-white/40 text-sm relative z-10 leading-relaxed">Join the PayXen ecosystem and revolutionize subscription management.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button size="lg" className="rounded-full px-10 h-14 font-bold hover-elevate shadow-xl shadow-primary/20" onClick={() => setLocation("/login")}>
                Email Us
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-10 h-14 font-bold text-white hover:bg-white/10 border border-white/5">
                Visit Discord
              </Button>
            </div>
          </div>

          {/* Right Decorative Box */}
          <div className="hidden lg:block w-32 h-32 relative group">
            <div className="absolute inset-0 bg-accent/20 rounded-2xl border border-accent/30 -rotate-12 group-hover:-rotate-90 transition-all duration-1000 ease-in-out blur-sm group-hover:blur-none" />
            <div className="absolute inset-0 bg-accent/10 rounded-2xl border border-accent/20 rotate-12 group-hover:rotate-90 transition-all duration-1000 ease-in-out group-hover:scale-125" />
            <div className="absolute inset-0 flex items-center justify-center text-accent opacity-50 group-hover:opacity-100 transition-opacity">
              <Shield className="w-8 h-8 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="font-display font-black text-3xl tracking-tighter text-white">
              PAYXEN
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed">
              The next generation of personal finance management. Built for the modern subscriber.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-white/40 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
          <p className="text-white/20 text-xs tracking-widest uppercase">
            © 2026 PayXen Labs. Designed for the future.
          </p>
          <div className="flex gap-8 text-white/20 text-xs tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}
