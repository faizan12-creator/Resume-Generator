"use client";

import { useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { FileText, Sparkles, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export default function CoverLetterPage() {
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/generate-cover-letter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, job_title: jobTitle, company: company, summary: summary }),
      });
      const data = await response.json();
      setCoverLetter(data.cover_letter);
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend.");
    }
    setLoading(false);
  };

  return (
    <main className={`${fraunces.variable} ${inter.variable} ${mono.variable} min-h-screen py-16 px-4 font-[family-name:var(--font-body)]`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Resume Builder
          </Link>
          <Link href="/cover-letter" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-[#C6A15B] text-[#10142C]">
            Cover Letter
          </Link>
          <Link href="/ats-checker" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            ATS Checker
          </Link>
          <Link href="/saved-resumes" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Saved Resumes
          </Link>
        </div>

        <h1 className="font-[family-name:var(--font-display)] italic text-4xl text-[#FBF8F2] text-center mb-2">
          Cover Letter Generator
        </h1>
        <p className="text-[#9AA1B9] text-center mb-10 text-sm">
          Let AI write a tailored cover letter for your job application
        </p>

        <TiltCard>
          <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-xl flex items-center gap-2">
                <FileText size={20} className="text-[#C6A15B]" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Full Name</Label>
                <Input placeholder="e.g. Faizan Gul" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Job Title</Label>
                  <Input placeholder="e.g. Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                </div>
                <div>
                  <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Company</Label>
                  <Input placeholder="e.g. Tech Corp" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                </div>
              </div>
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">Your Background</Label>
                <Textarea placeholder="Briefly describe your experience and skills..." value={summary}
                  onChange={(e) => setSummary(e.target.value)} rows={4}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <Button onClick={handleGenerate} disabled={loading}
                className="w-full bg-[#10142C] hover:bg-[#1a2044] text-[#FBF8F2] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Generating…</> : <><Sparkles size={16} /> Generate Cover Letter</>}
              </Button>

              {coverLetter && (
                <div className="stamp-in mt-2 p-4 rounded-xl border border-[#C6A15B]/40 bg-[#C6A15B]/10">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a6d2f] mb-2">
                    ✦ Your Cover Letter
                  </p>
                  <p className="text-[#10142C] leading-relaxed whitespace-pre-line text-sm">{coverLetter}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TiltCard>
      </div>
    </main>
  );
}