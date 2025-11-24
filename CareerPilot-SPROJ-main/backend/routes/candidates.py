from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from config import db
from services.candidate_utils import process_resume

router = APIRouter(tags=["Candidates"])

class EditEmailIn(BaseModel):
    email: EmailStr
    resend_invite: bool = False

class InviteRequest(BaseModel):
    email: EmailStr

@router.post("/upload-resumes", status_code=201)
async def upload_resumes(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    created = [await process_resume(file, None, background_tasks) for file in files]
    return {"created": created}

@router.get("/candidates")
async def list_candidates():
    rows = await db.candidates.find().sort("uploaded_at", -1).to_list(None)
    items = []
    invited = completed = in_progress = 0
    for r in rows:
        status = "Completed" if r.get("interview_completed") else r.get("status", "Invited")
        if status == "Invited": invited += 1
        elif status == "Completed": completed += 1
        elif status == "In Progress": in_progress += 1
        items.append({
            "id": str(r["_id"]),
            "email": r.get("email", ""),
            "full_name": r.get("full_name", ""),
            "domain": r.get("domain", ""),
            "skills": r.get("skills", []),
            "status": status,
            "temp_username": r.get("temp_username", ""),
            "uploaded_at": r.get("uploaded_at"),
        })
    return {"total": len(rows), "invited": invited, "completed": completed, "in_progress": in_progress, "candidates": items}

@router.put("/{candidate_id}/email")
async def edit_email(candidate_id: str, body: EditEmailIn):
    cand = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not cand:
        raise HTTPException(404, "Candidate not found")
    await db.candidates.update_one({"_id": ObjectId(candidate_id)}, {"$set": {"email": body.email}})
    return {"detail": "Email updated"}

@router.post("/{candidate_id}/send-invite")
async def send_candidate_invite(candidate_id: str, body: InviteRequest):
    cand = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    # reuse magic_token and send email
    return {"status": "success", "sent_to": body.email}
