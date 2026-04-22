
from fastapi import FastAPI
from app.db import create_db_and_tables

# auth 
from app.users import auth_backend, fastapi_users
from app.schemas import UserRead, UserCreate, UserUpdate

from contextlib import asynccontextmanager
from app.routers.notes_router import router as notes_router
from app.routers.ai_router import router as ai_router
from app.routers.user_router import router as user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
# endposints for auth
app.include_router(fastapi_users.get_auth_router(auth_backend),prefix="/auth/jwt",tags=["auth"])
app.include_router(fastapi_users.get_register_router(UserRead, UserCreate),prefix="/auth",tags=["auth"])
app.include_router(fastapi_users.get_reset_password_router(),prefix="/auth",tags=["auth"])
app.include_router(fastapi_users.get_verify_router(UserRead),prefix="/auth",tags=["auth"])
app.include_router(fastapi_users.get_users_router(UserRead, UserUpdate),prefix="/users",tags=["users"])
app.include_router(user_router, prefix="/user", tags=["user"])
app.include_router(notes_router, prefix="/notes", tags=["notes"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])