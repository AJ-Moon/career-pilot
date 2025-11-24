import os
import asyncio
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")

def build_interview_email_html(
    full_name: str,
    magic_url: str,
    temp_username: str,
    temp_password: str,
    job_title: str = None,
    job_seniority: str = None
) -> str:
    role_line = ""
    if job_title or job_seniority:
        role_line = f"<p><strong>Interviewing for role:</strong> {job_title or ''} {job_seniority or ''}</p>"

    return f"""
    <p>Hello {full_name or 'Candidate'},</p>
    <p>You are invited to an <b>AI mock interview</b>.</p>
    {role_line}
    <p><a href="{magic_url}" style="font-size:18px; color:#6A1B9A;">Start Interview</a></p>
    <p>Temporary login details:<br>
    Username: <b>{temp_username}</b><br>
    Password: <b>{temp_password}</b></p>
    <p>Best regards,<br/>CareerPilot Team</p>
    """


def send_sync_email(to: str, subject: str, html: str):
    if not SENDGRID_API_KEY:
        print("📧 [DEV EMAIL] To:", to)
        print("Subject:", subject)
        print(html)
        return

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to,
        subject=subject,
        html_content=html
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
        print(f"✅ Email sent to {to}")
    except Exception as e:
        print(f"❌ SendGrid error: {e}")

async def send_email_background(to: str, subject: str, html: str):
    await asyncio.to_thread(send_sync_email, to, subject, html)

async def send_invite_email(to: str, full_name: str, magic_token: str, temp_user: str, temp_pwd: str):
    magic_url = f"{FRONTEND_BASE_URL}/interview/magic/{magic_token}"
    html = build_interview_email_html(full_name, magic_url, temp_user, temp_pwd)
    await send_email_background(to, "AI Interview Invite", html)
