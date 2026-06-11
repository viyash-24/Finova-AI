from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import verify_clerk_token
from app.models.user import User

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    payload = verify_clerk_token(request)
    
    if not payload:
        # Check custom headers for mock auth
        mock_email = request.headers.get("x-mock-email")
        if mock_email:
            result = await db.execute(select(User).filter(User.email == mock_email))
            user = result.scalars().first()
            if not user:
                mock_name = request.headers.get("x-mock-name", "Mock User")
                user = User(
                    clerk_id=f"mock_{mock_email}",
                    email=mock_email,
                    name=mock_name,
                    is_active=True
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
            return user

        # Fallback to default user with ID 1
        result = await db.execute(select(User).filter(User.id == 1))
        user = result.scalars().first()
        if not user:
            user = User(
                id=1,
                clerk_id="default_clerk_user",
                email="alex@finova.ai",
                name="Alex",
                is_active=True
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    clerk_id = payload.get("sub")
    if not clerk_id:
        result = await db.execute(select(User).filter(User.id == 1))
        user = result.scalars().first()
        if not user:
            user = User(
                id=1,
                clerk_id="default_clerk_user",
                email="alex@finova.ai",
                name="Alex",
                is_active=True
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user
        
    result = await db.execute(select(User).filter(User.clerk_id == clerk_id))
    user = result.scalars().first()
    
    if not user:
        # Create user automatically if not exists
        user = User(
            clerk_id=clerk_id,
            email=payload.get("email_addresses", [""])[0] if "email_addresses" in payload else "unknown",
            name=payload.get("first_name", "Unknown")
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    return user
