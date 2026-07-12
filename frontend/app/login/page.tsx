"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { LogIn, Loader2 } from "lucide-react";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.full_name);
      localStorage.setItem("userEmail", data.email);
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Could not connect to backend.");
    }
    setLoading(false);
  };

  return (
    <main className={`${fraunces.variable} ${inter.variable} ${mono.variable} min-h-screen py-16 px-4 flex items-center justify-center font-[family-name:var(--font-body)]`}>
      <div className="w-full max-w-md">
        <h1 className="font-[family-name:var(--font-display)] italic text-4xl text-[#FBF8F2] text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-[#9AA1B9] text-center mb-8 text-sm">
          Log in to access your saved resumes
        </p>

        <TiltCard>
          <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-xl flex items-center gap-2">
                <LogIn size={20} className="text-[#C6A15B]" />
                Log In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Email</Label>
                <Input type="email" placeholder="e.g. faizan@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Password</Label>
                <Input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button onClick={handleLogin} disabled={loading}
                className="w-full bg-[#10142C] hover:bg-[#1a2044] text-[#FBF8F2] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Logging in…</> : "Log In"}
              </Button>

              <p className="text-center text-sm text-[#4A5068]">
                Don't have an account?{" "}
                <Link href="/signup" className="text-[#C6A15B] hover:underline">Sign up</Link>
              </p>
            </CardContent>
          </Card>
        </TiltCard>
      </div>
    </main>
  );
}