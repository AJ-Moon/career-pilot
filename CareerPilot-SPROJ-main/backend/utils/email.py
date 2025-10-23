from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

# Configure email settings
conf = ConnectionConfig(
    MAIL_USERNAME="furious123ahmad@gmail.com",
    MAIL_PASSWORD="wxdj tuzf dzhz vxlt",  # generate this from Google/App provider
    MAIL_FROM="furious123ahmad@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=False,
)

# Function to send verification email
async def send_verification_email(email: EmailStr, code: str):
    message = MessageSchema(
        subject="Verify your CareerPilot account",
        recipients=[email],  # must be a list
        body=f"""
        Hello,

        Thank you for signing up on CareerPilot 🚀

        Your verification code is: {code}

        Please enter this code in the app to verify your account.

        Regards,
        CareerPilot Team
        """,
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
