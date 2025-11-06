import os
import smtplib
import ssl
import asyncio

# SMTP Configuration
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER or "careerpilot@example.com")

# Frontend Base URL for Magic Link
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")

# Helper: Build HTML message 
def build_interview_email_html(full_name: str, magic_url: str, temp_username: str, temp_password: str) -> str:
    return f"""
    <p>Hello {full_name or 'Candidate'},</p>
    <p>You are invited to an <b>AI mock interview</b>.</p>
    <p><a href="{magic_url}" style="font-size:18px; color:#6A1B9A;">Start Interview</a></p>
    <p>Temporary login details:<br>
    Username: <b>{temp_username}</b><br>
    Password: <b>{temp_password}</b></p>
    <p>Best regards,<br/>CareerPilot Team</p>
    """

# Sync email sender
def send_sync_email(to: str, subject: str, html: str):
    if not SMTP_HOST:
        # Dev fallback — no real email, just print to console
        print("📧 [DEV EMAIL] To:", to)
        print("Subject:", subject)
        print(html)
        return

    # Setup secure SSL connection
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as smtp:
        smtp.login(SMTP_USER, SMTP_PASS)
        message = (
            f"From: CareerPilot <{FROM_EMAIL}>\r\n"
            f"To: {to}\r\n"
            f"Subject: {subject}\r\n"
            "MIME-Version: 1.0\r\n"
            "Content-Type: text/html; charset=utf-8\r\n\r\n"
            f"{html}"
        )
        smtp.sendmail(FROM_EMAIL, to, message.encode("utf-8"))

# Async background sender
async def send_email_background(to: str, subject: str, html: str):
    await asyncio.to_thread(send_sync_email, to, subject, html)

# Public function: Send invite
async def send_invite_email(to: str, full_name: str, magic_token: str, temp_user: str, temp_pwd: str):
    magic_url = f"{FRONTEND_BASE_URL}/interview/magic/{magic_token}"
    html = build_interview_email_html(full_name, magic_url, temp_user, temp_pwd)
    await send_email_background(to, "AI Interview Invite", html)
