from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
# from PyPDF2 import PdfReader

import pypdfium2
import re
import io
from datetime import datetime
from config import db
from .github_analysis import build_github_summary
from routes.dependencies import get_current_user

router = APIRouter(tags=["Resume"])
def extract_text_fast(pdf_bytes: bytes) -> str:
    pdf = pypdfium2.PdfDocument(io.BytesIO(pdf_bytes))
    text = "\n".join(page.get_textpage().get_text_range() for page in pdf)
    return text


def extract_name(lines):
    for line in lines[:4]:
        if re.search(r"\d", line) or "@" in line or "http" in line.lower():
            continue
        if re.match(r"^[A-Za-z\s\-]{2,50}$", line):
            return line.strip()
    return "Unknown"

def extract_section(lines, section_keyword, stop_keywords):
    capture = False
    results = []
    section_keyword_lower = section_keyword.lower()
    stop_keywords_lower = [k.lower() for k in stop_keywords]

    for line in lines:
        line_lower = line.lower()
        if any(k in line_lower for k in stop_keywords_lower):
            capture = False

        if section_keyword_lower in line_lower:
            capture = True
            continue

        if capture and line.strip():
            results.append(line.strip())
    return results

def parse_resume_regex(text: str):
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    name = extract_name(lines)

    edu_keywords = ["education", "school", "academic", "degree", "bachelor", "master", "university"]
    education = extract_section(lines, "education", stop_keywords=["skills", "projects", "experience"])
    if not education:
        education = [line for line in lines if any(k.lower() in line.lower() for k in edu_keywords)]

    skills_lines = extract_section(lines, "skills", stop_keywords=["education", "projects", "experience"])
    skills = []
    for line in skills_lines:
        for part in re.split(r"[,;•\-]", line):
            part_clean = part.strip()
            if part_clean and part_clean not in skills:
                skills.append(part_clean)

    projects = extract_section(lines, "project", stop_keywords=["education", "skills", "experience"])

    github = re.findall(r"(?:https?://)?github\.com/[^\s•]+", text)

    work_experience = extract_section(lines, "experience", stop_keywords=["education", "skills", "projects"])

    return {
        "name": name,
        "education": education,
        "skills": skills,
        "projects": projects,
        "github": github,
        "work_experience": work_experience
    }

def summarize_resume(parsed_data):
    def summarize_projects(items):
        summaries = []
        for item in items:
            lines = [line.strip() for line in item.splitlines() if line.strip()]
            if not lines:
                continue
            title = lines[0]  # first line as project title

            # Grab first bullet point or second line
            bullet = ""
            for line in lines[1:]:
                if re.match(r"^[•\-]", line):  # bullet point
                    bullet = line.lstrip("•- ").strip()
                    break
            if not bullet and len(lines) > 1:
                bullet = lines[1].strip()  # fallback

            summaries.append(f"{title}. {bullet}" if bullet else title)
        return summaries

    return {
        "name": parsed_data.get("name", "Unknown"),
        "education_summary": [line.split("|")[0] for line in parsed_data.get("education", [])[:3]],
        "projects_summary": summarize_projects(parsed_data.get("projects", [])),  # ALL projects
        "work_experience_summary": [line.split("|")[0] for line in parsed_data.get("work_experience", [])[:3]],
        "skills": parsed_data.get("skills", []),
        "github": parsed_data.get("github", [])
    }


def detect_domain(parsed_data):
    skills = [s.lower() for s in parsed_data.get("skills", [])]
    if any(s in skills for s in ["python", "java", "c++", "javascript", "fastapi", "django", "react"]):
        return "Software Engineering"
    if any(s in skills for s in ["pytorch", "tensorflow", "scikit-learn", "ml", "data"]):
        return "Data Science / ML"
    if any(s in skills for s in ["matlab", "circuit", "mechanical", "electrical"]):
        return "Electrical/Mechanical"
    if any(s in skills for s in ["docker", "aws", "kubernetes", "ci/cd"]):
        return "DevOps"
    if any(s in skills for s in ["security", "cybersecurity", "pentest"]):
        return "Cybersecurity"
    if any(s in skills for s in ["ui", "ux", "design", "figma", "adobe"]):
        return "Design"
    return "Other"

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)  
):
    user_id = current_user["_id"]

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file!")

    contents = await file.read()
    file_size_kb = len(contents) / 1024
    pdf_file = io.BytesIO(contents)

    try:
        text = extract_text_fast(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read PDF: {e}")

    parsed_data = parse_resume_regex(text)
    summary = summarize_resume(parsed_data)
    domain = detect_domain(parsed_data)

    github_summary = None
    if parsed_data["github"]:
        github_summary = build_github_summary(parsed_data["github"][0])

    resume_doc = {
        "user_id": user_id,
        "filename": file.filename,
        "parsed_data": parsed_data,
        "summary": summary,
        "domain": domain,
        "github_summary": github_summary,
        "updated_at": datetime.utcnow()
    }

    await db.resumes.update_one(
        {"user_id": user_id},
        {"$set": resume_doc},
        upsert=True
    )
    await db.users.update_one({"_id": user_id}, {"$set": {"domain": domain}})

    return {
        "user_id": str(user_id),
        "filename": file.filename,
        "content_type": file.content_type,
        "size_kb": round(file_size_kb, 2),
        "msg": "Resume uploaded and parsed successfully ✅",
        "parsed_data": parsed_data,
        "summary": summary,
        "domain": domain,
        "github_summary": github_summary
    }

@router.put("/update")
async def update_resume(
    updated: dict,
    current_user = Depends(get_current_user)
):
    user_id = current_user["_id"]

    if not isinstance(updated, dict) or "parsed_data" not in updated:
        raise HTTPException(status_code=400, detail="Expected a dict with 'parsed_data'")

    result = await db.resumes.update_one(
        {"user_id": user_id},
        {"$set": {
            "parsed_data": updated["parsed_data"],
            "updated_at": datetime.utcnow()
        }}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="No existing resume found for this user")

    return {"msg": "Parsed data updated ✅"}
