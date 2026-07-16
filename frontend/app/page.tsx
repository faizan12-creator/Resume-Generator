"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { ResumePreview } from "@/components/ui/ResumePreview";
import {
  User, Briefcase, GraduationCap, Tags, Sparkles, Download, Save,
  Plus, Trash2, Loader2, CheckCircle2, XCircle, LogIn, LogOut, FolderGit2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

interface Experience {
  jobTitle: string;
  company: string;
  dates: string;
  description: string;
  improvedBullets: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}
interface Project {
  title: string;
  link: string;
  description: string;
}

type ToastType = { message: string; kind: "success" | "error" } | null;

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");
  const [improvedSummary, setImprovedSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [experiences, setExperiences] = useState<Experience[]>([
    { jobTitle: "", company: "", dates: "", description: "", improvedBullets: "" },
  ]);
  const [loadingBulletIndex, setLoadingBulletIndex] = useState<number | null>(null);

  const [education, setEducation] = useState<Education[]>([
    { degree: "", institution: "", year: "" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { title: "", link: "", description: "" },
  ]);
  const [skills, setSkills] = useState("");
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern");

  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUserName(null);
    setToast({ message: "Logged out", kind: "success" });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await fetch(`${API_URL}/api/generate-summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, summary: summary }),
      });
      const data = await response.json();
      setImprovedSummary(data.improved_summary);
      setToast({ message: "Summary polished successfully", kind: "success" });
    } catch (error) {
      console.error("Error:", error);
      setToast({ message: "Could not connect to backend", kind: "error" });
    }
    setLoadingSummary(false);
  };

  const handleGenerateBullets = async (index: number) => {
    setLoadingBulletIndex(index);
    try {
      const exp = experiences[index];
      const response = await fetch(`${API_URL}/api/generate-bullets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_title: exp.jobTitle, description: exp.description }),
      });
      const data = await response.json();
      const updated = [...experiences];
      updated[index].improvedBullets = data.improved_bullets;
      setExperiences(updated);
      setToast({ message: "Bullet points generated", kind: "success" });
    } catch (error) {
      console.error("Error:", error);
      setToast({ message: "Could not connect to backend", kind: "error" });
    }
    setLoadingBulletIndex(null);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([...experiences, { jobTitle: "", company: "", dates: "", description: "", improvedBullets: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const addProject = () => {
    setProjects([...projects, { title: "", link: "", description: "" }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const buildResumeData = () => ({
  full_name: fullName,
  email: email,
  github: github,
  linkedin: linkedin,
  summary: improvedSummary || summary,
  experiences: experiences.map(({ jobTitle, company, dates, description, improvedBullets }) => ({
    jobTitle, company, dates, description: improvedBullets || description,
  })),
  education: education,
  projects: projects,
  skills: skills,
  template: template,
});

  const handleSaveResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ message: "Please log in to save your resume", kind: "error" });
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(buildResumeData()),
      });
      const data = await response.json();
      setToast({ message: `Saved! Resume ID: ${data.id}`, kind: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Could not save resume", kind: "error" });
    }
    setSaving(false);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/api/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildResumeData()),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName || "resume"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: "PDF downloaded", kind: "success" });
    } catch (error) {
      console.error(error);
      setToast({ message: "Could not generate PDF", kind: "error" });
    }
    setDownloading(false);
  };

  return (
    <main className={`${fraunces.variable} ${inter.variable} ${mono.variable} min-h-screen py-8 sm:py-16 px-3 sm:px-4 font-[family-name:var(--font-body)]`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          {userName ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9AA1B9] font-[family-name:var(--font-mono)]">
                Hi, {userName}
              </span>
              <button onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-white/10 text-[#9AA1B9] hover:bg-white/20 font-[family-name:var(--font-mono)]">
                <LogOut size={12} /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[#C6A15B] text-[#10142C] font-[family-name:var(--font-mono)]">
              <LogIn size={12} /> Login
            </Link>
          )}
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-[#C6A15B] text-[#10142C]">
            Resume Builder
          </Link>
          <Link href="/cover-letter" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Cover Letter
          </Link>
          <Link href="/ats-checker" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            ATS Checker
          </Link>
          <Link href="/saved-resumes" className="px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide bg-white/10 text-[#9AA1B9] hover:bg-white/20">
            Saved Resumes
          </Link>
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#C6A15B] mb-3 text-center">
          Draft — 01
        </p>
        <h1 className="font-[family-name:var(--font-display)] italic text-3xl sm:text-4xl text-[#FBF8F2] text-center mb-2">
          Resume Builder
        </h1>
        <p className="text-[#9AA1B9] text-center mb-8 sm:mb-10 text-sm px-2">
          Enter your details and let AI polish your resume
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-5 sm:space-y-6">
            {/* Personal Information */}
            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 stagger-1">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-lg sm:text-xl flex items-center gap-2">
                    <User size={20} className="text-[#C6A15B]" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5">
                  <div>
                    <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                      Full Name
                    </Label>
                    <Input placeholder="e.g. Faizan Gul" value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                  </div>

                  <div>
                    <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                      Email
                    </Label>
                    <Input type="email" placeholder="e.g. faizan@example.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                        GitHub
                      </Label>
                      <Input placeholder="github.com/username" value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                    </div>
                    <div>
                      <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                        LinkedIn
                      </Label>
                      <Input placeholder="linkedin.com/in/username" value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                    </div>
                  </div>

                  <div>
                    <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                      Professional Summary
                    </Label>
                    <Textarea placeholder="Write 2-3 lines about yourself and your experience..." value={summary}
                      onChange={(e) => setSummary(e.target.value)} rows={4}
                      className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                  </div>

                  <Button onClick={handleGenerateSummary} disabled={loadingSummary}
                    className="w-full bg-[#10142C] hover:bg-[#1a2044] text-[#FBF8F2] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                    {loadingSummary ? (
                      <><Loader2 size={16} className="animate-spin" /> Generating…</>
                    ) : (
                      <><Sparkles size={16} /> Polish Summary with AI</>
                    )}
                  </Button>

                  {improvedSummary && (
                    <div className="stamp-in mt-2 p-4 rounded-xl border border-[#C6A15B]/40 bg-[#C6A15B]/10">
                      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a6d2f] mb-2 flex items-center gap-1">
                        <Sparkles size={12} /> AI Improved Summary
                      </p>
                      <p className="text-[#10142C] leading-relaxed text-sm sm:text-base">{improvedSummary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TiltCard>

            {/* Work Experience */}
            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 stagger-2">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-lg sm:text-xl flex items-center gap-2">
                    <Briefcase size={20} className="text-[#C6A15B]" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="space-y-3 pb-5 border-b border-[#4A5068]/15 last:border-b-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                            Job Title
                          </Label>
                          <Input placeholder="e.g. Software Engineer" value={exp.jobTitle}
                            onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                            className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                        </div>
                        <div>
                          <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                            Company
                          </Label>
                          <Input placeholder="e.g. Tech Corp" value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                        </div>
                      </div>

                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          Dates
                        </Label>
                        <Input placeholder="e.g. Jan 2023 - Present" value={exp.dates}
                          onChange={(e) => updateExperience(index, "dates", e.target.value)}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>

                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          What did you do?
                        </Label>
                        <Textarea placeholder="Describe your responsibilities and achievements..." value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)} rows={3}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>

                      <Button onClick={() => handleGenerateBullets(index)} disabled={loadingBulletIndex === index}
                        variant="outline"
                        className="w-full border-[#10142C]/20 text-[#10142C] font-[family-name:var(--font-mono)] text-sm gap-2">
                        {loadingBulletIndex === index ? (
                          <><Loader2 size={14} className="animate-spin" /> Generating…</>
                        ) : (
                          <><Sparkles size={14} /> Polish with AI</>
                        )}
                      </Button>

                      {exp.improvedBullets && (
                        <div className="stamp-in p-4 rounded-xl border border-[#C6A15B]/40 bg-[#C6A15B]/10 whitespace-pre-line">
                          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8a6d2f] mb-2 flex items-center gap-1">
                            <Sparkles size={12} /> AI Improved Bullets
                          </p>
                          <p className="text-[#10142C] leading-relaxed text-sm">{exp.improvedBullets}</p>
                        </div>
                      )}

                      {experiences.length > 1 && (
                        <button onClick={() => removeExperience(index)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1">
                          <Trash2 size={12} /> Remove this entry
                        </button>
                      )}
                    </div>
                  ))}

                  <Button onClick={addExperience} variant="outline"
                    className="w-full border-[#4A5068]/30 text-[#4A5068] font-[family-name:var(--font-mono)] text-sm gap-2">
                    <Plus size={14} /> Add Another Experience
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>

            {/* Education */}
            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 stagger-3">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-lg sm:text-xl flex items-center gap-2">
                    <GraduationCap size={20} className="text-[#C6A15B]" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="space-y-3 pb-5 border-b border-[#4A5068]/15 last:border-b-0">
                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          Degree
                        </Label>
                        <Input placeholder="e.g. BS Computer Science" value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                            Institution
                          </Label>
                          <Input placeholder="e.g. UET Taxila" value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                        </div>
                        <div>
                          <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                            Year
                          </Label>
                          <Input placeholder="e.g. 2026" value={edu.year}
                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                            className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                        </div>
                      </div>

                      {education.length > 1 && (
                        <button onClick={() => removeEducation(index)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1">
                          <Trash2 size={12} /> Remove this entry
                        </button>
                      )}
                    </div>
                  ))}

                  <Button onClick={addEducation} variant="outline"
                    className="w-full border-[#4A5068]/30 text-[#4A5068] font-[family-name:var(--font-mono)] text-sm gap-2">
                    <Plus size={14} /> Add Another Education
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>

            {/* Projects */}
            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-lg sm:text-xl flex items-center gap-2">
                    <FolderGit2 size={20} className="text-[#C6A15B]" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {projects.map((proj, index) => (
                    <div key={index} className="space-y-3 pb-5 border-b border-[#4A5068]/15 last:border-b-0">
                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          Project Title
                        </Label>
                        <Input placeholder="e.g. Resume Builder AI" value={proj.title}
                          onChange={(e) => updateProject(index, "title", e.target.value)}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>
                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          Project Link (GitHub / Live Demo)
                        </Label>
                        <Input placeholder="e.g. https://github.com/username/project" value={proj.link}
                          onChange={(e) => updateProject(index, "link", e.target.value)}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>
                      <div>
                        <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                          Description
                        </Label>
                        <Textarea placeholder="What does this project do? What tech did you use?" value={proj.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)} rows={3}
                          className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                      </div>

                      {projects.length > 1 && (
                        <button onClick={() => removeProject(index)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1">
                          <Trash2 size={12} /> Remove this entry
                        </button>
                      )}
                    </div>
                  ))}

                  <Button onClick={addProject} variant="outline"
                    className="w-full border-[#4A5068]/30 text-[#4A5068] font-[family-name:var(--font-mono)] text-sm gap-2">
                    <Plus size={14} /> Add Another Project
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>

            {/* Skills */}
            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 stagger-4">
                <CardHeader>
                  <CardTitle className="font-[family-name:var(--font-display)] text-[#10142C] text-lg sm:text-xl flex items-center gap-2">
                    <Tags size={20} className="text-[#C6A15B]" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[#4A5068]">
                    Comma-separated
                  </Label>
                  <Textarea placeholder="e.g. Python, React, SQL, Project Management" value={skills}
                    onChange={(e) => setSkills(e.target.value)} rows={2}
                    className="mt-1 border-[#4A5068]/30 focus-visible:ring-[#C6A15B]" />
                </CardContent>
              </Card>
            </TiltCard>

            <TiltCard>
              <Card className="bg-[#FBF8F2] border-none shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-3 duration-500 stagger-5">
                <CardContent className="pt-6 space-y-3">
                  <Button onClick={handleDownloadPdf} disabled={downloading}
                    className="w-full bg-[#C6A15B] hover:bg-[#b8934e] text-[#10142C] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                    {downloading ? (
                      <><Loader2 size={16} className="animate-spin" /> Preparing PDF…</>
                    ) : (
                      <><Download size={16} /> Download PDF</>
                    )}
                  </Button>
                  <Button onClick={handleSaveResume} disabled={saving} variant="outline"
                    className="w-full border-[#10142C]/20 text-[#10142C] font-[family-name:var(--font-mono)] tracking-wide gap-2">
                    {saving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving…</>
                    ) : (
                      <><Save size={16} /> Save Resume</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <div className="flex gap-2 justify-center flex-wrap">
              {(["modern", "classic", "minimal"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`px-4 py-2 rounded-full text-xs font-[family-name:var(--font-mono)] uppercase tracking-wide transition-colors ${
                    template === t
                      ? "bg-[#C6A15B] text-[#10142C]"
                      : "bg-white/10 text-[#9AA1B9] hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="animate-in fade-in duration-500">
              <ResumePreview
                fullName={fullName}
                email={email}
                github={github}
                linkedin={linkedin}
                summary={summary}
                improvedSummary={improvedSummary}
                experiences={experiences}
                education={education}
                projects={projects}
                skills={skills}
                template={template}
              />
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl font-[family-name:var(--font-mono)] text-sm ${
            toast.kind === "success"
              ? "bg-[#1F6F5C] text-white"
              : "bg-red-600 text-white"
          }`}>
            {toast.kind === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
}