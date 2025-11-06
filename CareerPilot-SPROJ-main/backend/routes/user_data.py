# routes/user_data.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
from config import db
from typing import Optional

router = APIRouter(tags=["User Data"])

# -----------------------------
# Pydantic Models
# -----------------------------
class UserCreate(BaseModel):
    clerk_id: str
    email: EmailStr
    role: str  # "candidate" or "recruiter"

class UserUpdate(BaseModel):
    resume_summary: Optional[str] = None
    github_summary: Optional[str] = None

# -----------------------------
# ROUTES
# -----------------------------

@router.post("/create")
async def create_user(data: UserCreate):
    """
    Called after Clerk signup.
    Saves basic user info and role to MongoDB.
    """
    existing = await db.users.find_one({"clerk_id": data.clerk_id})
    if existing:
        return {"msg": "User already exists", "user_id": str(existing["_id"])}

    user_doc = {
        "clerk_id": data.clerk_id,
        "email": data.email,
        "role": data.role,
        "resume_summary": None,
        "github_summary": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_doc)
    return {
        "msg": "User created successfully ✅",
        "user_id": str(result.inserted_id),
    }


@router.get("/{clerk_id}")
async def get_user(clerk_id: str):
    """
    Fetch a user's info by Clerk ID.
    """
    user = await db.users.find_one({"clerk_id": clerk_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user["_id"] = str(user["_id"])
    return user


@router.put("/{clerk_id}")
async def update_user(clerk_id: str, updates: UserUpdate):
    """
    Update user's resume_summary, github_summary, or role.
    """
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()

    result = await db.users.update_one({"clerk_id": clerk_id}, {"$set": update_data})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"msg": "User updated successfully ✅"}


@router.delete("/{clerk_id}")
async def delete_user(clerk_id: str):
    """
    Remove a user by Clerk ID (optional).
    """
    result = await db.users.delete_one({"clerk_id": clerk_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "User deleted successfully ❌"}
