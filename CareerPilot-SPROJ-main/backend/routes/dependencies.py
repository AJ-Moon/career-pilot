# dependencies.py
import time
from typing import Dict
import httpx
from fastapi import HTTPException, Header
from jose import jwt, JWTError
from jose.utils import base64url_decode
from jose import jwk
import jwt
from config import db

JWKS_URL = "https://stable-turkey-86.clerk.accounts.dev/.well-known/jwks.json"
JWKS_CACHE = {"keys": None, "fetched_at": 0}
JWKS_CACHE_TTL = 300  # cache for 5 minutes

async def get_current_user(authorization: str = Header(...)):
    """
    Verify Clerk JWT via JWKS and fetch current user from MongoDB.
    """

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = authorization.split(" ")[1]

    # Fetch or reuse JWKS
    now = time.time()
    if not JWKS_CACHE["keys"] or now - JWKS_CACHE["fetched_at"] > JWKS_CACHE_TTL:
        async with httpx.AsyncClient() as client:
            resp = await client.get(JWKS_URL)
            if resp.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to fetch Clerk keys")
            JWKS_CACHE["keys"] = resp.json()
            JWKS_CACHE["fetched_at"] = now

    jwks = JWKS_CACHE["keys"]

    # Decode JWT using the correct RSA public key
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        if not kid:
            raise HTTPException(status_code=401, detail="JWT missing kid header")

        key_data = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
        if not key_data:
            raise HTTPException(status_code=401, detail="Matching key not found in JWKS")

        public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key_data)

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_aud": False}  # Clerk doesn't require audience check
        )

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired Clerk token: {str(e)}")

    clerk_id = payload.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Fetch user from MongoDB
    user = await db.users.find_one({"clerk_id": clerk_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
