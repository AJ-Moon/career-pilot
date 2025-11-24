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

IGNORE_PATTERNS = [
    r"support@", r"info@", r"admin@", r"noreply@", r"github\.com", r"linkedin\.com"
]

def extract_email_from_text(text: str, top_chars: int = 500) -> Optional[str]:
    """
    Extract the most likely candidate email from resume text.

    Steps:
    1. Find all email-like strings in the text using regex.
    2. Filter out obvious non-personal emails.
    3. Prefer emails appearing in the first `top_chars` characters (top of document).
    4. Fallback to first remaining email anywhere.
    """
    print("📝 --- Raw PDF text start ---")
    print(text[:1000])  # print first 1000 chars for readability
    print("📝 --- Raw PDF text end ---\n")
    # Find all emails
    text = text.replace("\u200b", "").replace("\xa0", " ").strip()
    emails = EMAIL_RE.findall(text)
    # if email:
    #  print([ord(c) for c in email])
    # else:
    #  print("No email found")

    print(f"🔍 All emails found: {emails}")
    if not emails:
        print("hi")
        return None
    

    # Filter out ignored patterns
    filtered_emails = []
    for email in emails:
        print("hi1")
        if any(re.search(pat, email, re.IGNORECASE) for pat in IGNORE_PATTERNS):
            print("hi2")
            continue
        filtered_emails.append(email)

    if not filtered_emails:
        print("hi3")
        return None

    # Prefer email in the top of document
    top_text = text[:top_chars]
    for email in filtered_emails:
        if email in top_text:
            return email.lower()

    # Fallback: return first filtered email anywhere
    print("hi4")
    print("final",filtered_emails[0].lower())
    return filtered_emails[0].lower()


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