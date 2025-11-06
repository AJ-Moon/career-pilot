import motor.motor_asyncio
import os
from dotenv import load_dotenv
import certifi
from clerk_backend_api import Clerk

load_dotenv()

# MongoDB config
MONGO_URI = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI,
    tlsCAFile=certifi.where() )
db = client.careerpilot


# You’ll need to add this to your .env:
# CLERK_SECRET_KEY=sk_test_*************************
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

# JWT config
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

# Email config (if used)
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# === Recruiter-Specific Settings ===
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "./uploads/resumes")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")  # for dev
# Ensure uploads folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# === Email (optional) ===
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
