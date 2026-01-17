import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ghost, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { loginMutation, registerMutation, user } = useAuth();
  
  const isLogin = location === "/login";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-black to-black" />
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-violet-600 shadow-lg shadow-violet-500/20 mb-4 cursor-pointer">
              <Ghost className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-400">
            {isLogin ? "Enter your credentials to access your dashboard" : "Start managing your subscriptions today"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Username</Label>
            <Input 
              type="text" 
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:ring-fuchsia-500/50 focus:border-fuchsia-500 h-11"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-300">Password</Label>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:ring-fuchsia-500/50 focus:border-fuchsia-500 h-11"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 bg-white text-black hover:bg-gray-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link href={isLogin ? "/register" : "/login"}>
            <span className="text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer font-medium">
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
