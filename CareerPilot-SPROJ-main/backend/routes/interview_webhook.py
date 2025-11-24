# app/routes/interview_webhook.py
from fastapi import APIRouter, HTTPException
from config import db

router = APIRouter(tags=["Webhooks"])

@router.post("/interview-completed")
async def interview_completed(payload: dict):
    """
    Expects payload like:
    { "temp_username": "cand_abc", "technical_score": 85, "behavioural_score": 78, "report_url": "..." }
    """
    if "temp_username" not in payload:
        raise HTTPException(status_code=400, detail="temp_username required")
    res = await db.candidates.update_one(
        {"temp_username": payload["temp_username"]},
        {"$set": {
            "interview_completed": True,
            "technical_score": payload.get("technical_score"),
            "behavioural_score": payload.get("behavioural_score"),
            "report_url": payload.get("report_url"),
            "completed_at": payload.get("completed_at")
        }}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {"status": "updated"}
