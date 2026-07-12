"use client";

import { useState } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { Target, Loader2, CheckCircle2, XCircle } from "lucide-react";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

interface ATSResult {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
}

export default function ATSCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend.");
    }
    setLoading(false);
  };

  const scoreColor = result
    ? result.score >= 70
      ? "#1F6F5C"
      : result.score >= 40
      ? "#C6A15B"
      : "#B23A3A"
    : "#4A5068";

  return (
    <main className={`${fraunces.variable} ${inter.variable} ${mono.variable} min-h-screen py-16 px-4 font-[family-name:var(--font-body)]`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Resume Builder
          </Link>
          <Link href="/cover-letter" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Cover Letter
          </Link>
          <Link href="/ats-checker" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-[#C6A15B] text-[#10142C]">
            ATS Checker
          </Link>
          <Link href="/saved-resumes" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Saved Resumes
          </Link>
        </div>

        <h1 className="font-[family-name:var(--font-display)] italic text-4xl text-[#FBF8F2] text-center mb-2">
          ATS Score Checker
        </h1>
        <p className="text-[#9AA1B9] text-center mb-10 text-sm">
          See how well your resume matches a job description
        </p>

        <TiltCard>
          <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-xl flex items-center gap-2">
                <Target size={20} className="text-[#C6A15B]" />
                Compare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                  Your Resume Text
                </Label>
                <Textarea placeholder="Paste your resume content here..." value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)} rows={6}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <div>
                <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                  Job Description
                </Label>
                <Textarea placeholder="Paste the job description here..." value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)} rows={6}
                  className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
              </div>
              <Button onClick={handleCheck} disabled={loading}
                className="w-full bg-[#10142C] hover:bg-[#1a2044] text-[#FBF8F2] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <><Target size={16} /> Check ATS Score</>}
              </Button>

              {result && (
                <div className="stamp-in mt-2 space-y-4">
                  <div className="text-center p-6 rounded-xl border-2" style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}15` }}>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: scoreColor }}>
                      Match Score
                    </p>
                    <p className="text-5xl font-bold" style={{ color: scoreColor }}>{result.score}%</p>
                  </div>

                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#1F6F5C] mb-2 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Matched Keywords ({result.matched_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched_keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#1F6F5C]/10 text-[#1F6F5C] border border-[#1F6F5C]/30">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-red-600 mb-2 flex items-center gap-1">
                      <XCircle size={12} /> Missing Keywords ({result.missing_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TiltCard>
      </div>
    </main>
  );
}