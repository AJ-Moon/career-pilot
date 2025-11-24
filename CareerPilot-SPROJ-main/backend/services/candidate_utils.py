import os, random, string
from datetime import datetime
from fastapi import UploadFile, BackgroundTasks
from bson import ObjectId
from typing import Optional

from config import db
from utils import save_upload, extract_email_from_text, get_text_from_pdf, create_clerk_user
from routes.resume import parse_resume_regex
from clerk_backend_api import Clerk
from emailer import build_interview_email_html, send_email_background

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

def random_string(length=32):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

async def process_resume(
    file: UploadFile,
    job_id: Optional[str],
    background_tasks: BackgroundTasks,
    job_title: Optional[str] = None,
    job_seniority: Optional[str] = None
):
    # Save PDF & extract text
    path = await save_upload(file)
    text = get_text_from_pdf(path) or ""
    parsed = parse_resume_regex(text)

    name = parsed.get("name") or "Candidate"
    domain = parsed.get("domain")
    skills = parsed.get("skills", [])

    real_email = extract_email_from_text(text) or f"{random_string(8)}@placeholder.ai"
    clerk_creds = create_clerk_user(full_name=name)
    magic_token = random_string(32)


    candidate_doc = {
        "job_id": job_id,
        "email": real_email,
        "full_name": name,
        "domain": domain,
        "skills": skills[:20],
        "status": "Uploaded",  # start as Uploaded, move to Invited when email sent
        "job_role": job_title,        # <-- add this
        "job_seniority": job_seniority,  # <-- add this
        "resume_filename": os.path.basename(path),
        "resume_path": path,
        "temp_username": clerk_creds["email"],
        "temp_password": clerk_creds["password"],
        "clerk_user_id": clerk_creds["clerk_user_id"],
        "magic_token": magic_token,
        "uploaded_at": datetime.utcnow(),
        "invite_sent": False,
        "interview_completed": False,
    }


    ins = await db.candidates.insert_one(candidate_doc)

    # Build invite email with job context
    frontend_base = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
    magic_url = f"{frontend_base.rstrip('/')}/interview/magic/{magic_token}"
    html = build_interview_email_html(
        name,
        magic_url,
        clerk_creds["email"],
        clerk_creds["password"],
        job_title=job_title,
        job_seniority=job_seniority
    )

    background_tasks.add_task(
        send_email_background,
        real_email,
        "CareerPilot: AI Interview Invite",
        html
    )

    return {"id": str(ins.inserted_id), "email": real_email, "filename": file.filename}
