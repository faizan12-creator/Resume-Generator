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

interface ResumePreviewProps {
  fullName: string;
  email: string;
  summary: string;
  improvedSummary: string;
  experiences: Experience[];
  education: Education[];
  skills: string;
  template: "modern" | "classic" | "minimal";
}

export function ResumePreview({
  fullName, email, summary, improvedSummary, experiences, education, skills, template,
}: ResumePreviewProps) {
  const displaySummary = improvedSummary || summary;

  if (template === "classic") {
    return (
      <div className="bg-white text-black p-8 shadow-2xl rounded-sm min-h-[600px] font-serif">
        <div className="text-center border-b-2 border-black pb-3 mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide">{fullName || "Your Name"}</h1>
          <p className="text-sm mt-1">{email || "your.email@example.com"}</p>
        </div>
        {displaySummary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Summary</h2>
            <p className="text-sm leading-relaxed">{displaySummary}</p>
          </div>
        )}
        {experiences.some((e) => e.jobTitle) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Experience</h2>
            {experiences.map((exp, i) => exp.jobTitle && (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{exp.jobTitle} — {exp.company}</span>
                  <span className="italic font-normal">{exp.dates}</span>
                </div>
                <p className="text-sm whitespace-pre-line">{exp.improvedBullets || exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {education.some((e) => e.degree) && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Education</h2>
            {education.map((edu, i) => edu.degree && (
              <div key={i} className="text-sm mb-1">
                <span className="font-bold">{edu.degree}</span> — {edu.institution} ({edu.year})
              </div>
            ))}
          </div>
        )}
        {skills && (
          <div>
            <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Skills</h2>
            <p className="text-sm">{skills}</p>
          </div>
        )}
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="bg-white text-gray-800 p-8 shadow-2xl rounded-sm min-h-[600px] font-sans">
        <h1 className="text-3xl font-light mb-1">{fullName || "Your Name"}</h1>
        <p className="text-sm text-gray-500 mb-6">{email || "your.email@example.com"}</p>
        {displaySummary && (
          <p className="text-sm text-gray-700 leading-relaxed mb-6 border-l-2 border-gray-300 pl-4">
            {displaySummary}
          </p>
        )}
        {experiences.some((e) => e.jobTitle) && (
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Experience</h2>
            {experiences.map((exp, i) => exp.jobTitle && (
              <div key={i} className="mb-3 border-l-2 border-gray-300 pl-4">
                <p className="text-sm font-medium">{exp.jobTitle} · {exp.company}</p>
                <p className="text-xs text-gray-400 mb-1">{exp.dates}</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{exp.improvedBullets || exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {education.some((e) => e.degree) && (
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Education</h2>
            {education.map((edu, i) => edu.degree && (
              <p key={i} className="text-sm border-l-2 border-gray-300 pl-4 mb-1">
                {edu.degree} · {edu.institution} · {edu.year}
              </p>
            ))}
          </div>
        )}
        {skills && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
            <p className="text-sm text-gray-600 border-l-2 border-gray-300 pl-4">{skills}</p>
          </div>
        )}
      </div>
    );
  }

  // Modern template (default)
  return (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden min-h-[600px] font-sans">
      <div className="bg-[#10142C] text-white p-6">
        <h1 className="text-2xl font-semibold">{fullName || "Your Name"}</h1>
        <p className="text-sm text-[#C6A15B] mt-1">{email || "your.email@example.com"}</p>
      </div>
      <div className="p-6">
        {displaySummary && (
          <div className="mb-5">
            <h2 className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2 pb-1 border-b border-[#C6A15B]/30">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{displaySummary}</p>
          </div>
        )}
        {experiences.some((e) => e.jobTitle) && (
          <div className="mb-5">
            <h2 className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2 pb-1 border-b border-[#C6A15B]/30">
              Experience
            </h2>
            {experiences.map((exp, i) => exp.jobTitle && (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-[#10142C]">{exp.jobTitle} — {exp.company}</span>
                  <span className="text-gray-400 text-xs">{exp.dates}</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{exp.improvedBullets || exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {education.some((e) => e.degree) && (
          <div className="mb-5">
            <h2 className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2 pb-1 border-b border-[#C6A15B]/30">
              Education
            </h2>
            {education.map((edu, i) => edu.degree && (
              <p key={i} className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{edu.degree}</span> — {edu.institution} ({edu.year})
              </p>
            ))}
          </div>
        )}
        {skills && (
          <div>
            <h2 className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold mb-2 pb-1 border-b border-[#C6A15B]/30">
              Skills
            </h2>
            <p className="text-sm text-gray-600">{skills}</p>
          </div>
        )}
      </div>
    </div>
  );
}