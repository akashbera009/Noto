import uuid 
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager,FastAPIUsers,UUIDIDMixin,models
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy 
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from .db import User,get_user_db

SECRET="akashbera009"

# setting jwt secrets + optional call back functions
class Usermanager(UUIDIDMixin, BaseUserManager[User,uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret   = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered")

    async def on_after_request_verify(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has verified")


# usermanager
async def get_user_manager(user_db : SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield Usermanager(user_db)

# jwt configs 
bearer_transport = BearerTransport(tokenUrl='auth/jwt/login')

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=36000)

auth_backend = AuthenticationBackend(
    name='jwt',
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,   
)

fastapi_users = FastAPIUsers[User,uuid.UUID](get_user_manager, auth_backends=[auth_backend])
current_active_user = fastapi_users.current_user(active=True)