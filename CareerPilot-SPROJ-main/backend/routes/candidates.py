from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, EmailStr
import os

from config import db, UPLOAD_FOLDER
from utils import save_upload, extract_email_from_text, get_text_from_pdf, random_string, create_clerk_user
from routes.resume import parse_resume_regex

from clerk_backend_api import Clerk
from emailer import build_interview_email_html, send_email_background



# Initialize Clerk client
clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

router = APIRouter(tags=["Candidates"])

# -------------------- MODELS --------------------
class CandidateOut(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    domain: Optional[str]
    skills: List[str] = []
    status: str
    temp_username: str
    uploaded_at: datetime

class EditEmailIn(BaseModel):
    email: EmailStr
    resend_invite: bool = False

# -------------------- UPLOAD RESUMES --------------------
@router.post("/upload-resumes", status_code=201)
async def upload_resumes(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    created = []

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF resumes are accepted")

        path = await save_upload(file)
        text = get_text_from_pdf(path)
        parsed = parse_resume_regex(text or "")

        real_email = extract_email_from_text(text) or f"{random_string(8)}@placeholder.ai"
        name = parsed.get("name") or None
        domain = parsed.get("domain") or None
        skills = parsed.get("skills") or []

        # --- Create Clerk user using a random email ---
        clerk_creds = create_clerk_user(full_name=name)

        # Store candidate in DB with real email
        magic_token = random_string(32)
        doc = {
            "email": real_email,  # candidate's actual email
            "full_name": name,
            "domain": domain,
            "skills": skills[:20],
            "status": "Invited",
            "resume_filename": os.path.basename(path),
            "resume_path": path,
            "temp_username": clerk_creds["email"],  # random Clerk email
            "temp_password": clerk_creds["password"], # random password
            "clerk_user_id": clerk_creds["clerk_user_id"],
            "magic_token": magic_token,
            "uploaded_at": datetime.utcnow(),
            "interview_completed": False,
            "technical_score": None,
            "behavioural_score": None
        }

        ins = await db.candidates.insert_one(doc)
        created.append({"id": str(ins.inserted_id), "email": real_email})

        # Schedule sending invite to the candidate's real email
        frontend_base = os.getenv("FRONTEND_BASE_URL", "https://your-frontend.com")
        magic_url = f"{frontend_base.rstrip('/')}/interview/magic/{magic_token}"
        html = build_interview_email_html(name, magic_url, clerk_creds["email"], clerk_creds["password"])
        background_tasks.add_task(send_email_background, real_email, "CareerPilot: AI Interview Invite", html)
        print(f"📧 Invite email scheduled to: {real_email} with temp username: {clerk_creds['email']}")


    return {"created": created}

# -------------------- LIST CANDIDATES --------------------
@router.get("/candidates", response_model=dict)
async def list_candidates():
    rows = await db.candidates.find().sort("uploaded_at", -1).to_list(None)
    items = []
    invited, completed, in_progress, total = 0, 0, 0, len(rows)

    for r in rows:
        status = "Completed" if r.get("interview_completed") else r.get("status", "Invited")
        if status == "Invited":
            invited += 1
        elif status == "Completed":
            completed += 1
        elif status == "In Progress":
            in_progress += 1    

        items.append({
            "id": str(r["_id"]),
            "email": r["email"],
            "full_name": r.get("full_name", ""),
            "domain": r.get("domain", ""),
            "skills": r.get("skills", []),
            "status": status,
            "temp_username": r.get("temp_username", ""),
            "uploaded_at": r.get("uploaded_at")
        })

    return {
        "total": total,
        "invited": invited,
        "completed": completed,
        "in_progress": in_progress,
        "candidates": items
    }

# -------------------- EDIT EMAIL --------------------
# @router.put("/{candidate_id}/email")
# async def edit_email(candidate_id: str, body: EditEmailIn):
#     cand = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
#     if not cand:
#         raise HTTPException(404, "Candidate not found")

#     # Update candidate email in DB
#     await db.candidates.update_one({"_id": ObjectId(candidate_id)}, {"$set": {"email": body.email}})

#     if body.resend_invite:
#         # Update Clerk user email
#         clerk.users.update(
#             user_id=cand["clerk_user_id"],
#             emails=[{"email_address": body.email, "primary": True}]
#         )
#         # Send Clerk invite
#         clerk.users.send_invite_email(user_id=cand["clerk_user_id"])
#         print(f"📧 Resent invite email to: {body.email} for Clerk user: {cand['clerk_user_id']}")

#     return {"detail": "Email updated & invite resent" if body.resend_invite else "Email updated"}