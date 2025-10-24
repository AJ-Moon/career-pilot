from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
import motor.motor_asyncio
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from config import db, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_MINUTES
from pydantic import BaseModel, EmailStr, validator
import re
import random
from utils.email import send_verification_email
import certifi

load_dotenv()

router = APIRouter(tags=["Auth"])

verification_codes = {}
# MongoDB

client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URI"),
    tlsCAFile=certifi.where() )

db = client["careerpilot"]
users = db["users"]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pending_users = {}

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    @validator("password")
    def validate_password(cls, value):
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
        if not re.match(pattern, value):
            raise ValueError(
                "Password must be at least 8 characters long, "
                "include Uppercase, Lowercase, Number, and Special Character"
            )
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str 

class VerifyCode(BaseModel):
    email: EmailStr
    code: str

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup")
async def signup(user: UserSignup):
    existing = await users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    code = str(random.randint(100000, 999999))

    hashed_pw = pwd_context.hash(user.password)
    pending_users[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "code": code,
        "expires": datetime.utcnow() + timedelta(minutes=10),
    }

    await send_verification_email(user.email, code)
    return {"msg": "Verification code sent to email"}

@router.post("/verify")
async def verify(data: VerifyCode):
     print(f"Skipping email: {email} / code: {code}")
#     if data.email not in pending_users:
#         raise HTTPException(status_code=400, detail="No pending signup found")

#     record = pending_users[data.email]

#     if datetime.utcnow() > record["expires"]:
#         del pending_users[data.email]
#         raise HTTPException(status_code=400, detail="Verification code expired")

#     if data.code != record["code"]:
#         raise HTTPException(status_code=400, detail="Invalid verification code")

#     new_user = {
#         "name": record["name"],
#         "email": record["email"],
#         "password": record["password"],
#     }
#     await users.insert_one(new_user)
#     del pending_users[data.email]

#     token = create_token({"sub": new_user["email"]})
#     return {
#        "msg": "Email verified successfully ✅",
# "user": {"name": new_user["name"], "email": new_user["email"]}, "token": token}



@router.post("/login")
async def login(user: UserLogin):
    db_user = await users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": db_user["email"]})
    return {"user": {"name": db_user["name"], "email": db_user["email"]}, "token": token}
