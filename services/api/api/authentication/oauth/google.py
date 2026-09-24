import httpx
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from services.api.db_models.ai_config import ApiConfig
from services.api.models.user import User
from services.api.core.admin_config import get_admin_settings
from services.api.core.config import settings as app_settings

class GoogleOAuthService:
    @staticmethod
    async def get_login_url(db: AsyncSession) -> str:
        settings = get_admin_settings()
        client_id = settings.google_client_id
        if not client_id:
            raise HTTPException(status_code=503, detail="Google OAuth not configured. Admin must set google_client_id via admin panel.")
        
        redirect_uri = f"{app_settings.API_BASE_URL.rstrip('/')}/auth/google/callback"
        url = (
            f"{app_settings.GOOGLE_OAUTH_AUTHORIZE_URL}"
            f"?client_id={client_id}"
            f"&redirect_uri={redirect_uri}"
            f"&response_type=code"
            f"&scope=openid email profile"
        )
        return url

    @staticmethod
    async def handle_callback(code: str, db: AsyncSession) -> User:
        settings = get_admin_settings()
        client_id = settings.google_client_id
        client_secret = settings.google_client_secret
        
        if not client_id or not client_secret:
            raise HTTPException(status_code=503, detail="Google OAuth not fully configured.")

        redirect_uri = f"{app_settings.API_BASE_URL.rstrip('/')}/auth/google/callback"
        
        try:
            async with httpx.AsyncClient() as client:
                token_resp = await client.post(app_settings.GOOGLE_OAUTH_TOKEN_URL, data={
                    "code": code, "client_id": client_id, "client_secret": client_secret,
                    "redirect_uri": redirect_uri, "grant_type": "authorization_code",
                }, timeout=10)
                token_data = token_resp.json()
                access_token = token_data.get("access_token")
                
                if not access_token:
                    raise HTTPException(status_code=400, detail=f"Google token exchange failed: {token_data}")

                user_resp = await client.get(app_settings.GOOGLE_USERINFO_URL,
                                             headers={"Authorization": f"Bearer {access_token}"}, timeout=10)
                profile = user_resp.json()
                
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Google API error: {str(e)}")

        google_id = profile.get("sub")
        email = profile.get("email")
        
        result_user = await db.execute(select(User).filter(User.email == email))
        user = result_user.scalars().first()
        
        if not user:
            user = User(email=email, is_active=True)
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        return user
