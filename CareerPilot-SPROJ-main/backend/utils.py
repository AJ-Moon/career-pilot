import uuid, random, string, re, aiofiles, os
from pathlib import Path
from PyPDF2 import PdfReader
from typing import Optional
from config import UPLOAD_FOLDER
import random
import string
from clerk_backend_api import Clerk

# Initialize Clerk client once
clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
# ensure upload folder exists
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")

def random_string(k: int = 8) -> str:
    """Random alpha-numeric string."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=k))

async def save_upload(file) -> str:
    """
    Save uploaded file and return the full path on disk.
    Accepts any extension (caller is responsible to validate).
    """
    ext = file.filename.split(".")[-1].lower()
    fname = f"{uuid.uuid4().hex}.{ext}"
    dest = Path(UPLOAD_FOLDER) / fname

    # write file asynchronously
    async with aiofiles.open(dest, "wb") as out:
        # rewind file (UploadFile might be reused)
        await file.seek(0)
        while chunk := await file.read(1024 * 1024):
            await out.write(chunk)
    return str(dest)

def extract_email_from_text(text: str) -> Optional[str]:
    """Return first matched email in text (lowercased) or None."""
    m = EMAIL_RE.search(text)
    return m.group(0).lower() if m else None

def get_text_from_pdf(path: str) -> str:
    """
    Synchronous PDF text extraction using PyPDF2.
    Returns concatenated text of all pages.
    """
    try:
        with open(path, "rb") as fh:
            reader = PdfReader(fh)
            text = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text.append(page_text)
            return "\n".join(text)
    except Exception:
        return ""



def create_clerk_user(full_name: str = None):
    # Generate random email & password
    random_email = f"{''.join(random.choices(string.ascii_lowercase+string.digits, k=10))}@placeholder.ai"
    random_password = "".join(random.choices(string.ascii_letters + string.digits, k=12))

    # Split full name
    first_name, last_name = None, None
    if full_name:
        parts = full_name.split()
        first_name = parts[0]
        last_name = " ".join(parts[1:]) if len(parts) > 1 else None

    # Create Clerk user
    user = clerk.users.create(
        email_address=[random_email],
        password=random_password,
        first_name=first_name,
        last_name=last_name
    )

    return {
        "clerk_user_id": user.id,
        "email": random_email,
        "password": random_password
    }