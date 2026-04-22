from fastapi import APIRouter, Depends, HTTPException
from app.users import current_active_user
from sqlalchemy.future import select

from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_async_session, User
from app.schemas import  UserCreate, UserUpdate, UserRead ,UserResponse,UserNameUpdate
from fastapi import File, UploadFile, Form
import tempfile
from app.images import imagekit
import shutil
import os

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(current_active_user)
):
    return current_user

# profile pic update 
@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_name: str = Form(None),
    profile_image: UploadFile = File(...),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    if user_name:
        user.user_name = user_name

    temp_file_path = None 

    try:
        with tempfile.NamedTemporaryFile(delete=False , suffix=os.path.splitext(profile_image.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(profile_image.file , temp_file)
        upload_result = imagekit.files.upload(
            file=open(temp_file_path, 'rb'),
            file_name=profile_image.filename,
            folder="/temp_images",
            tags=['backend-upload']
        )
        user.profile_image = upload_result.url
        await session.commit()
        await session.refresh(user)
        return user
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code = 500 , detail=str(e))
    finally: 
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        profile_image.file.close()


 # name update 
@router.put("/profile/name" , response_model=UserResponse)
async def update_profile_name(
    user_in: UserNameUpdate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    user.user_name = user_in.user_name
    await session.commit()
    await session.refresh(user)
    return user
