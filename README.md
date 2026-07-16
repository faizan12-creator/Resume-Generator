📄 Resume Builder — AI-Powered Resume & Career Toolkit

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-Frontend-blue?logo=typescript) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.11+-yellow?logo=python) ![AI](https://img.shields.io/badge/AI-Llama%203.3-purple) ![License](https://img.shields.io/badge/License-MIT-green)

A full-stack AI-powered platform that helps job seekers build professional, ATS-friendly resumes, generate tailored cover letters, and check their resume's match against any job description — all in one place.

Enterprise-style interface featuring **live resume previews, AI content polishing, PDF export, secure authentication, and ATS scoring** — built end-to-end with Next.js and FastAPI.

**🔗 Live Demo:** https://resume-generator-knuawnf41-faizan12-creators-projects.vercel.app/
---

## ✨ Features

### 🧠 AI-Powered Content

| Feature | Details |
|---|---|
| 🤖 AI Summary Polish | Rewrites your professional summary to be concise, confident, and ATS-friendly |
| 📝 AI Bullet Point Polish | Converts raw job descriptions into achievement-focused, action-verb bullet points |
| ✉️ Cover Letter Generator | Generates a tailored, professional cover letter for any job title and company |
| 🎯 ATS Score Checker | Compares your resume against a job description and returns a match score with matched/missing keywords |

### 🎨 Resume Builder

| Feature | Details |
|---|---|
| 👀 Live Preview | See your resume update in real time as you type |
| 🖼️ Multiple Templates | Choose between Modern, Classic, and Minimal designs |
| 📂 Projects Section | Showcase personal projects with links (GitHub, live demos, etc.) |
| 📥 ATS-Optimized PDF Export | Clean, single-column PDF designed to pass Applicant Tracking Systems |

### 🔐 Accounts & Storage

| Feature | Details |
|---|---|
| 🔑 Secure Authentication | JWT-based signup/login with bcrypt password hashing |
| 💾 Save Resumes | Save multiple resumes tied to your account |
| 📋 Resume Dashboard | View and delete previously saved resumes |

### ⚡ Interface

| Feature | Details |
|---|---|
| 🎬 Smooth Animations | Staggered entrance animations, page transitions, and toast notifications |
| 📱 Mobile Optimized | Touch-aware components that disable heavy effects on mobile for performance |
| 🪄 3D Tilt Cards | Subtle interactive tilt effect on desktop for a premium feel |

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Lucide React icons

**Backend**
- FastAPI (Python)
- SQLAlchemy + SQLite
- Groq API (Llama 3.3 70B) for AI generation
- JWT auth + bcrypt password hashing
- FPDF2 for PDF generation

**Deployment**
- 🌐 Frontend → Vercel
- 🚂 Backend → Railway

---

## 📁 Project Structure

```
Resume Generator/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers (auth, resumes)
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # AI, PDF, and ATS logic
│   │   └── db/           # Database session
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx              # Resume builder (home)
    │   ├── cover-letter/
    │   ├── ats-checker/
    │   ├── saved-resumes/
    │   ├── login/ & signup/
    │   └── globals.css
    └── components/ui/
```

---

## 🚀 Getting Started

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

Create `backend/.env`:
```
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_random_secret_key_here
```

Run:
```bash
uvicorn main:app --reload
```
📖 API docs: `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Run:
```bash
npm run dev
```
🌐 App: `http://localhost:3000`

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | `POST` | Create a new user account |
| `/api/auth/login` | `POST` | Authenticate and receive a JWT token |
| `/api/generate-summary` | `POST` | AI-polish a professional summary |
| `/api/generate-bullets` | `POST` | AI-polish work experience bullet points |
| `/api/generate-cover-letter` | `POST` | Generate a tailored cover letter |
| `/api/ats-score` | `POST` | Compare resume text vs. job description |
| `/api/generate-pdf` | `POST` | Generate and download a resume PDF |
| `/api/resumes` | `GET` / `POST` | List or save resumes 🔒 |
| `/api/resumes/{id}` | `GET` / `DELETE` | Retrieve or delete a resume 🔒 |

🔒 = requires authentication

Full interactive documentation available via Swagger UI at `/docs`.

---

## 🗺️ Roadmap

- [ ] Improve ATS keyword matching with stemming/synonym support
- [ ] Add more resume templates
- [ ] Support editing previously saved resumes
- [ ] Add PDF export for cover letters

---

## 👤 Author

**Faizan Gul**
BS Software Engineering — UET Taxila

[![GitHub](https://img.shields.io/badge/GitHub-faizan12--creator-black?logo=github)](https://github.com/faizan12-creator)

---

## 📜 License

This project is licensed under the MIT License — free to use for personal and educational purposes.
