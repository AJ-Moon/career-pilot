from fastapi import APIRouter, Depends
from config import db
# from ..auth import get_current_recruiter

router = APIRouter(tags=["Dashboard"])

@router.get("/metrics")
async def get_metrics():
    total = await db.candidates.count_documents({})
    completed = await db.candidates.count_documents({ "interview_completed": True})
    pending = total - completed
    pipeline = [
        {"$match": { "interview_completed": True}},
        {"$project": {"avg": {"$avg": ["$technical_score", "$behavioural_score"]}}},
        {"$group": {"_id": None, "average": {"$avg": "$avg"}}}
    ]
    res = await db.candidates.aggregate(pipeline).to_list(1)
    avg = round(res[0]["average"], 2) if res else 0.0
    return {"total_candidates": total, "completed_interviews": completed, "pending_interviews": pending, "average_score": avg}

@router.get("/activity/recent")
async def recent_activity():
    rows = await db.candidates.find().sort("uploaded_at", -1).limit(6).to_list(6)
    out = []
    for r in rows:
        out.append({
            "email": r["email"],
            "action": "Completed interview" if r.get("interview_completed") else "Interview invite sent",
            "score": (r.get("technical_score") + r.get("behavioural_score")) / 2 if r.get("technical_score") else None,
            "time": r.get("completed_at") or r["uploaded_at"]
        })
    return out