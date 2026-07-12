from fpdf import FPDF

def clean_text(text: str) -> str:
    """Replace special characters that some ATS parsers can't read properly."""
    if not text:
        return text
    replacements = {
        "—": "-", "–": "-", "•": "-",
        "'": "'", "'": "'", """: '"', """: '"',
        "…": "...",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def generate_resume_pdf(data) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(left=18, top=15, right=18)

    # --- Name & Contact (plain text, no header/footer tricks) ---
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(0, 9, clean_text(data.full_name), ln=True)

    pdf.set_font("Helvetica", "", 10)
    if data.email:
        pdf.cell(0, 6, clean_text(data.email), ln=True)
    pdf.ln(3)

    def section_heading(title: str):
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 7, title.upper(), ln=True)
        pdf.set_draw_color(0, 0, 0)
        pdf.set_line_width(0.4)
        pdf.line(pdf.get_x(), pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
        pdf.ln(3)

    # --- Professional Summary ---
    if data.summary:
        section_heading("Professional Summary")
        pdf.set_font("Helvetica", "", 10.5)
        pdf.multi_cell(0, 5.5, clean_text(data.summary))
        pdf.ln(4)

    # --- Work Experience ---
    if data.experiences and any(e.jobTitle for e in data.experiences):
        section_heading("Work Experience")
        for exp in data.experiences:
            if not exp.jobTitle:
                continue
            pdf.set_font("Helvetica", "B", 11)
            pdf.cell(0, 6, clean_text(f"{exp.jobTitle} - {exp.company}"), ln=True)

            pdf.set_font("Helvetica", "", 9.5)
            pdf.cell(0, 5, clean_text(exp.dates), ln=True)
            pdf.ln(1)

            pdf.set_font("Helvetica", "", 10)
            description = clean_text(exp.description)
            for line in description.split("\n"):
                line = line.strip()
                if not line:
                    continue
                if not line.startswith("-"):
                    line = f"- {line}"
                pdf.multi_cell(0, 5.5, line)
            pdf.ln(3)

    # --- Education ---
    if data.education and any(e.degree for e in data.education):
        section_heading("Education")
        for edu in data.education:
            if not edu.degree:
                continue
            pdf.set_font("Helvetica", "B", 10.5)
            pdf.cell(0, 5.5, clean_text(edu.degree), ln=True)
            pdf.set_font("Helvetica", "", 10)
            pdf.cell(0, 5.5, clean_text(f"{edu.institution} - {edu.year}"), ln=True)
            pdf.ln(2)
        pdf.ln(2)

    # --- Skills ---
    if data.skills:
        section_heading("Skills")
        pdf.set_font("Helvetica", "", 10)
        skills_list = [s.strip() for s in data.skills.split(",") if s.strip()]
        pdf.multi_cell(0, 5.5, clean_text(", ".join(skills_list)))

    output = pdf.output()
    return bytes(output)