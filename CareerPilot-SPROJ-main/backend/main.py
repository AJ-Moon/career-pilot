from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth
from config import db 
from routes import resume
from routes import user_data,practice
from routes import candidates, dashboard,interview_webhook,jobs


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","https://career-pilot-gilt.vercel.app","https://career-pilot-s24d.onrender.com",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
async def test_db():
    try:
        await db.command("ping")
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)

# === Candidate Routes ===
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(user_data.router, prefix="/api/users", tags=["User Data"])
app.include_router(practice.router, prefix="/api/practice", tags=["Practice"])

# === Recruiter Routes ===
app.include_router(candidates.router, prefix="/api/recruiter/candidates", tags=["Recruiter - Candidates"])
app.include_router(dashboard.router, prefix="/api/recruiter/dashboard", tags=["Recruiter - Dashboard"])
app.include_router(interview_webhook.router, prefix="/api/webhooks", tags=["Webhooks"])

app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])

@app.get("/")
def root():
    return {"message": "CareerPilot FastAPI backend running!"}

if __name__ == "__main__":
    import uvicorn, os
    port = int(os.environ.get("PORT", 5005))  
    uvicorn.run("main:app", host="0.0.0.0", port=port)
