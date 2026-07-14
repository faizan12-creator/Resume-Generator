"use client";

import { useState, useEffect } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { FolderOpen, Trash2, Loader2, Mail, Calendar } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

interface SavedResume {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchResumes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/resumes`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await response.json();
      setResumes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/resumes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert("Could not delete resume.");
    }
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <main className={`${fraunces.variable} ${inter.variable} ${mono.variable} min-h-screen py-16 px-4 font-[family-name:var(--font-body)]`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Resume Builder
          </Link>
          <Link href="/cover-letter" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Cover Letter
          </Link>
          <Link href="/ats-checker" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            ATS Checker
          </Link>
          <Link href="/saved-resumes" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-[#C6A15B] text-[#10142C]">
            Saved Resumes
          </Link>
        </div>

        <h1 className="font-[family-name:var(--font-display)] italic text-4xl text-[#FBF8F2] text-center mb-2">
          Saved Resumes
        </h1>
        <p className="text-[#9AA1B9] text-center mb-10 text-sm">
          All the resumes you've saved so far
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#C6A15B]" />
          </div>
        ) : resumes.length === 0 ? (
          <TiltCard>
            <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
              <CardContent className="py-12 text-center">
                <FolderOpen size={40} className="mx-auto text-[#4A5068]/40 mb-3" />
                <p className="text-[#4A5068]">No saved resumes yet.</p>
                <Link href="/" className="text-sm text-[#C6A15B] hover:underline mt-2 inline-block">
                  Create your first resume →
                </Link>
              </CardContent>
            </Card>
          </TiltCard>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <TiltCard key={resume.id}>
                <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl">
                  <CardContent className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-[#10142C] text-lg font-semibold">
                        {resume.full_name || "Untitled"}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#4A5068]">
                        {resume.email && (
                          <span className="flex items-center gap-1">
                            <Mail size={12} /> {resume.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {formatDate(resume.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(resume.id)}
                      disabled={deletingId === resume.id}
                      variant="outline"
                      size="icon"
                      className="border-red-200 text-red-600 hover:bg-red-50 shrink-0"
                    >
                      {deletingId === resume.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}