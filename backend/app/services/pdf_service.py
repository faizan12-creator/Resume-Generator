from fpdf import FPDF


def wrap_long_words(text: str, max_len: int = 60) -> str:
    if not text:
        return text
    lines = text.split("\n")
    wrapped_lines = []
    for line in lines:
        words = line.split(" ")
        result = []
        for word in words:
            if len(word) > max_len:
                chunks = [word[i:i + max_len] for i in range(0, len(word), max_len)]
                result.append(" ".join(chunks))
            else:
                result.append(word)
        wrapped_lines.append(" ".join(result))
    return "\n".join(wrapped_lines)


def clean_text(text: str) -> str:
    if not text:
        return text
    replacements = {
        "—": "-", "–": "-", "•": "-",
        "'": "'", "'": "'", """: '"', """: '"',
        "…": "...",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    text = text.encode("latin-1", errors="replace").decode("latin-1")
    text = wrap_long_words(text)
    return text


THEMES = {
    "modern": {
        "font": "Helvetica",
        "accent": (198, 161, 91),
        "header_box": (16, 20, 44),
        "name_align": "L",
        "heading_style": "bold_line",
    },
    "classic": {
        "font": "Times",
        "accent": (0, 0, 0),
        "header_box": None,
        "name_align": "C",
        "heading_style": "underline_caps",
    },
    "minimal": {
        "font": "Helvetica",
        "accent": (120, 120, 120),
        "header_box": None,
        "name_align": "L",
        "heading_style": "light_label",
    },
}


def generate_resume_pdf(data) -> bytes:
    theme = THEMES.get(getattr(data, "template", "modern"), THEMES["modern"])
    font = theme["font"]
    accent = theme["accent"]

    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(left=18, top=15, right=18)

    if theme["header_box"]:
        box_color = theme["header_box"]
        pdf.set_fill_color(*box_color)
        pdf.rect(0, 0, pdf.w, 30, "F")
        pdf.set_xy(18, 8)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font(font, "B", 18)
        pdf.cell(0, 9, clean_text(data.full_name), ln=True)
        pdf.set_x(18)
        pdf.set_text_color(*accent)
        pdf.set_font(font, "", 10)
        if data.email:
            pdf.cell(0, 6, clean_text(data.email), ln=True)
        pdf.set_text_color(0, 0, 0)
        pdf.set_y(38)
    else:
        pdf.set_font(font, "B", 20 if theme["name_align"] == "C" else 18)
        pdf.cell(0, 9, clean_text(data.full_name), ln=True, align=theme["name_align"])
        pdf.set_font(font, "", 10)
        if data.email:
            pdf.cell(0, 6, clean_text(data.email), ln=True, align=theme["name_align"])
        pdf.ln(2)
        if theme["heading_style"] == "underline_caps":
            pdf.set_draw_color(0, 0, 0)
            pdf.set_line_width(0.6)
            pdf.line(18, pdf.get_y(), pdf.w - 18, pdf.get_y())
        pdf.ln(3)

    def section_heading(title: str):
        if theme["heading_style"] == "bold_line":
            pdf.set_font(font, "B", 12)
            pdf.set_text_color(*accent)
            pdf.cell(0, 7, title.upper(), ln=True)
            pdf.set_text_color(0, 0, 0)
            pdf.set_draw_color(*accent)
            pdf.set_line_width(0.4)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(3)
        elif theme["heading_style"] == "underline_caps":
            pdf.set_font(font, "B", 12)
            pdf.cell(0, 7, title.upper(), ln=True, align="C")
            pdf.set_draw_color(0, 0, 0)
            pdf.set_line_width(0.3)
            pdf.line(pdf.get_x(), pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
            pdf.ln(3)
        else:
            pdf.set_font(font, "", 10)
            pdf.set_text_color(*accent)
            pdf.cell(0, 6, title.upper(), ln=True)
            pdf.set_text_color(0, 0, 0)
            pdf.ln(2)

    def title_with_dates(title_text: str, dates_text: str):
        pdf.set_font(font, "B", 11)
        available_w = pdf.w - pdf.l_margin - pdf.r_margin

        if not dates_text:
            pdf.cell(0, 6, title_text, ln=1)
            return

        dates_w = 40
        title_w = available_w - dates_w

        pdf.cell(title_w, 6, title_text, ln=0)
        pdf.set_font(font, "I", 9.5)
        pdf.cell(dates_w, 6, dates_text, ln=1, align="R")

    if data.summary:
        section_heading("Professional Summary")
        pdf.set_font(font, "", 10.5)
        pdf.multi_cell(0, 6, clean_text(data.summary))
        pdf.ln(5)

    if data.experiences and any(e.jobTitle for e in data.experiences):
        section_heading("Work Experience")
        for exp in data.experiences:
            if not exp.jobTitle:
                continue
            title_with_dates(
                clean_text(f"{exp.jobTitle} - {exp.company}"),
                clean_text(exp.dates),
            )
            pdf.ln(2)

            pdf.set_font(font, "", 10)
            description = clean_text(exp.description)
            for line in description.split("\n"):
                line = line.strip()
                if not line:
                    continue
                if not line.startswith("-"):
                    line = f"- {line}"
                pdf.multi_cell(0, 6, line)
                pdf.ln(1)
            pdf.ln(4)

    if data.education and any(e.degree for e in data.education):
        section_heading("Education")
        for edu in data.education:
            if not edu.degree:
                continue
            title_with_dates(clean_text(edu.degree), clean_text(str(edu.year)))
            pdf.set_font(font, "", 10)
            pdf.cell(0, 6, clean_text(edu.institution), ln=True)
            pdf.ln(3)
        pdf.ln(2)

    if data.projects and any(p.title for p in data.projects):
        section_heading("Projects")
        for proj in data.projects:
            if not proj.title:
                continue
            pdf.set_font(font, "B", 11)
            pdf.cell(0, 6, clean_text(proj.title), ln=True)
            if proj.link:
                pdf.set_font(font, "I", 9.5)
                pdf.set_text_color(100, 100, 100)
                pdf.cell(0, 5, clean_text(proj.link), ln=True)
                pdf.set_text_color(0, 0, 0)
            pdf.set_font(font, "", 10)
            pdf.multi_cell(0, 6, clean_text(proj.description))
            pdf.ln(4)

    if data.skills:
        section_heading("Skills")
        pdf.set_font(font, "", 10)
        skills_list = [s.strip() for s in data.skills.split(",") if s.strip()]
        pdf.multi_cell(0, 6, clean_text(", ".join(skills_list)))

    output = pdf.output()
    return bytes(output)