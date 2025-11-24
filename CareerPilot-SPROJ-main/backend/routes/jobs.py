from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks
from pydantic import BaseModel
from typing import List
from bson import ObjectId
from config import db
from datetime import datetime
from services.candidate_utils import process_resume
from emailer import build_interview_email_html, send_email_background

router = APIRouter(tags=["Jobs"])

# -------------------- MODELS --------------------
class JobCreate(BaseModel):
    title: str = ""
    description: str = ""
    skills: List[str] = []
    questions: List[str] = []
    seniority: str = ""

# -------------------- SHARED INVITE HELPER --------------------
async def send_invite(candidate: dict, job: dict, background_tasks: BackgroundTasks, email_override: str = None):
    email = email_override or candidate.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email required")

    magic_token = candidate.get("magic_token") or "manual-" + str(datetime.utcnow().timestamp())

    frontend_base = "http://localhost:5173"  # or from env
    magic_url = f"{frontend_base.rstrip('/')}/interview/magic/{magic_token}"

    html = build_interview_email_html(
        candidate.get("full_name", "Candidate"),
        magic_url,
        candidate.get("temp_username", ""),
        candidate.get("temp_password", ""),
        job_title=job.get("title"),
        job_seniority=job.get("seniority")
    )

    background_tasks.add_task(
        send_email_background,
        email,
        "CareerPilot: AI Interview Invite",
        html
    )

    await db.candidates.update_one(
        {"_id": candidate["_id"]},
        {"$set": {
            "email": email,
            "invite_sent": True,
            "magic_token": magic_token,
            "status": "Invited"
        }}
    )

    return {"status": "invite_sent", "candidate_id": str(candidate["_id"]), "job_id": str(job["_id"]), "email": email}

# -------------------- JOB ROUTES --------------------
@router.post("/")
async def create_job(job: JobCreate = JobCreate()):
    job_data = {**job.dict(), "createdAt": datetime.utcnow(), "isActive": True}
    result = await db.jobs.insert_one(job_data)
    return {"jobId": str(result.inserted_id)}

@router.get("/")
async def list_jobs():
    jobs = await db.jobs.find().to_list(length=100)
    enriched = []

    for job in jobs:
        job_id = str(job["_id"])
        rows = await db.candidates.find({"job_id": job_id}).to_list(None)

        resumes_count = len(rows)
        interviewed_count = sum(1 for r in rows if r.get("status") == "Interviewed")
        shortlisted_count = sum(1 for r in rows if r.get("status") == "Shortlisted")

        progress = 0
        if resumes_count > 0:
            progress = int(((interviewed_count + shortlisted_count) / resumes_count) * 100)

        enriched.append({
            "_id": job_id,
            "title": job.get("title", ""),
            "description": job.get("description", ""),
            "skills": job.get("skills", []),
            "questions": job.get("questions", []),
            "seniority": job.get("seniority", ""),
            "createdAt": job.get("createdAt"),
            "isActive": job.get("isActive", True),
            "resumesCount": resumes_count,
            "interviewedCount": interviewed_count,
            "shortlistedCount": shortlisted_count,
            "progress": progress,
        })

    return enriched

@router.get("/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job["_id"] = str(job["_id"])
    return job

@router.put("/{job_id}")
async def update_job(job_id: str, job: JobCreate):
    result = await db.jobs.update_one({"_id": ObjectId(job_id)}, {"$set": job.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True}

@router.put("/{job_id}/toggle_active")
async def toggle_job_active(job_id: str, payload: dict):
    is_active = payload.get("isActive", True)
    result = await db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"isActive": is_active}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True, "isActive": is_active}

# -------------------- JOB-SCOPED CANDIDATE ROUTES --------------------
@router.post("/{job_id}/candidates/upload-resumes", status_code=201)
async def upload_resumes_for_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_title = job.get("title", "")
    job_seniority = job.get("seniority", "")

    created = [
        await process_resume(file, job_id, background_tasks, job_title, job_seniority)
        for file in files
    ]
    return {"created": created}

@router.get("/{job_id}/candidates")
async def list_candidates_for_job(job_id: str):
    rows = await db.candidates.find({"job_id": job_id}).sort("uploaded_at", -1).to_list(None)
    if not rows:
        return {"total": 0, "candidates": []}

    items = []
    invited = completed = in_progress = 0

    for r in rows:
        status = "Completed" if r.get("interview_completed") else r.get("status", "Invited")
        if status == "Invited":
            invited += 1
        elif status == "Completed":
            completed += 1
        elif status == "In Progress":
            in_progress += 1

        # ✅ append inside the loop
        items.append({
            "id": str(r["_id"]),
            "full_name": r.get("full_name", ""),
            "email": r.get("email", ""),
            "job_role": r.get("job_role", ""),
            "job_seniority": r.get("job_seniority", ""),
            "skills": r.get("skills", []),
            "status": status,
            "uploaded_at": r.get("uploaded_at"),
        })

    return {
        "job_id": job_id,
        "total": len(rows),
        "invited": invited,
        "completed": completed,
        "in_progress": in_progress,
        "candidates": items,
    }


@router.post("/{job_id}/candidates/{candidate_id}/send-invite")
async def send_invite_for_job_candidate(job_id: str, candidate_id: str, payload: dict, background_tasks: BackgroundTasks):
    email = payload.get("email")
    job = await db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    cand = await db.candidates.find_one({"_id": ObjectId(candidate_id), "job_id": job_id})
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found for this job")

    return await send_invite(cand, job, background_tasks, email_override=email)
