import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Users,
  LogOut,
  Ghost
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { href: "/groups", icon: Users, label: "Groups" },
  ];

  if (!user) {
    // Should be handled by router protection, but failsafe
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/40 bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-border/40">
          <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
              <Ghost className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white group-hover:text-primary transition-colors">SubX</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group
                    ${isActive 
                      ? "bg-primary/10 text-primary shadow-sm border border-primary/20" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
