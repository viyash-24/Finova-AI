from fastapi import Request
import jwt
from typing import Optional

def verify_clerk_token(request: Request) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        # Decode without verification for development/testing
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception:
        return None
