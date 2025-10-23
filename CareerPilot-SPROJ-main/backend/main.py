from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth
from config import db 
from routes import resume
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173","https://career-pilot-gilt.vercel.app",],
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

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])

@app.options("/{full_path:path}")
async def preflight(full_path: str):
    return {}

@app.get("/")
def root():
    return {"message": "CareerPilot FastAPI backend running!"}

@app.middleware("http")
async def debug_cors(request, call_next):
    response = await call_next(request)
    print("CORS headers:", response.headers.get("access-control-allow-origin"))
    return response


if __name__ == "__main__":
    import uvicorn, os
    port = int(os.environ.get("PORT", 5005))  
    uvicorn.run("main:app", host="0.0.0.0", port=port)
    
