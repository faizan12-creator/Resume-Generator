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
import { UserPlus, Loader2 } from "lucide-react";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Signup failed");
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
          Create Account
        </h1>
        <p className="text-[#9AA1B9] text-center mb-8 text-sm">
          Sign up to save your resumes
        </p>

        <TiltCard>
          <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-xl flex items-center gap-2">
                <UserPlus size={20} className="text-[#C6A15B]" />
                Sign Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Full Name</Label>
                <Input placeholder="e.g. Faizan Gul" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Email</Label>
                <Input type="email" placeholder="e.g. faizan@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Password</Label>
                <Input type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <Button onClick={handleSignup} disabled={loading}
                className="w-full bg-[#10142C] hover:bg-[#1a2044] text-[#FBF8F2] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : "Create Account"}
              </Button>

              <p className="text-center text-sm text-[#4A5068]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#C6A15B] hover:underline">Log in</Link>
              </p>
            </CardContent>
          </Card>
        </TiltCard>
      </div>
    </main>
  );
}