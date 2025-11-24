import os
import httpx

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")  # make sure this is set

JWKS_URL = "https://api.clerk.dev/v1/keys"

resp = httpx.get(
    JWKS_URL,
    headers={"Authorization": f"Bearer {CLERK_SECRET_KEY}"}
)

print("Status code:", resp.status_code)
print("Response preview:", resp.text[:500])
