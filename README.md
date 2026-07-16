# AI Resume Builder

A full-stack AI-powered resume builder that helps job seekers create professional, ATS-friendly resumes in minutes. Built with a modern tech stack combining Next.js, FastAPI, and Groq's LLM API.

**Live Demo:** https://resume-generator-by-faizan.vercel.app/

---

## Features

- **AI Content Generation** — Instantly polish your professional summary and work experience bullet points using AI (powered by Groq's Llama 3.3 model)
- **Live Resume Preview** — See your resume update in real time as you type, with three selectable templates: Modern, Classic, and Minimal
- **ATS-Optimized PDF Export** — Download a clean, single-column PDF designed to pass Applicant Tracking Systems, matching your selected template style
- **Cover Letter Generator** — Generate a tailored cover letter based on your background and the job you're applying for
- **ATS Score Checker** — Paste a job description and your resume to get a match score, along with matched and missing keywords
- **User Authentication** — Secure sign-up/login system (JWT-based) so users can save and manage multiple resumes
- **Saved Resumes Dashboard** — View, revisit, and delete previously saved resumes
- **Projects Section** — Showcase personal or professional projects with links (e.g. GitHub, live demos)
- **Responsive, Animated UI** — Custom-designed interface with 3D tilt cards, smooth transitions, and mobile-optimized performance

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Lucide React (icons)

**Backend**
- FastAPI (Python)
- SQLAlchemy + SQLite
- Groq API (Llama 3.3 70B) for AI content generation
- JWT authentication with bcrypt password hashing
- FPDF2 for PDF generation

**Deployment**
- Frontend: Vercel
- Backend: Railway

---

## Project Structure

```
Resume Generator/
├── backend/
│   ├── app/
│   │   ├── api/          # API route handlers (auth, resumes)
│   │   ├── models/       # SQLAlchemy database models
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── services/     # AI, PDF, and ATS scoring logic
│   │   └── db/           # Database session setup
│   ├── main.py           # FastAPI app entry point
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx              # Resume builder (home)
    │   ├── cover-letter/         # Cover letter generator page
    │   ├── ats-checker/          # ATS score checker page
    │   ├── saved-resumes/        # Saved resumes dashboard
    │   ├── login/ & signup/      # Authentication pages
    │   └── globals.css
    └── components/ui/            # Reusable UI components
```

---

## Getting Started (Local Setup)

### Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_random_secret_key_here
```

Run the backend:
```bash
uvicorn main:app --reload
```
API docs available at `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run the frontend:
```bash
npm run dev
```
App available at `http://localhost:3000`

---

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Create a new user account |
| `/api/auth/login` | POST | Authenticate and receive a JWT token |
| `/api/generate-summary` | POST | AI-polish a professional summary |
| `/api/generate-bullets` | POST | AI-polish work experience bullet points |
| `/api/generate-cover-letter` | POST | Generate a tailored cover letter |
| `/api/ats-score` | POST | Compare resume text against a job description |
| `/api/generate-pdf` | POST | Generate and download a resume PDF |
| `/api/resumes` | GET / POST | List or save resumes (auth required) |
| `/api/resumes/{id}` | GET / DELETE | Retrieve or delete a specific resume (auth required) |

Full interactive documentation is available via Swagger UI at `/docs` once the backend is running.

---

## Roadmap

- [ ] Improve ATS keyword matching with stemming/synonym support
- [ ] Add more resume templates
- [ ] Support editing previously saved resumes
- [ ] Add PDF export for cover letters

---

## Author

**Faizan Gul**
BS Software Engineering — UET Taxila

- GitHub: [@faizan12-creator](https://github.com/faizan12-creator)

---

## License

This project is open source and available for personal and educational use.
