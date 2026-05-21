
from pydantic import BaseModel
from fastapi_users import schemas 
import uuid 
from typing import Optional
from uuid import UUID
class NoteCreate(BaseModel):
    title: str = "Untitled"
    tags: list[str] = []
    content: str

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    tags: Optional[list[str]] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: uuid.UUID
    title: str | None
    tags: list[str]
    content: str

    class Config:
        from_attributes = True

class ExplainRequest(BaseModel):
    mode: str  # "simple" or "technical"

class ExplanationResponse(BaseModel):
    note: str
    explanation: str
    mode: str

class SummarizeResponse(BaseModel):
    note: str
    summary: str


# inherite built-in schemas from fast-api-users
class UserRead(schemas.BaseUser[uuid.UUID]):
    user_name: str
    profile_image: str

class UserCreate(schemas.BaseUserCreate):
    user_name: str
    profile_image: str

class UserUpdate(BaseModel):
    user_name: Optional[str] = None
    profile_image: Optional[str] = None

class UserResponse(schemas.BaseUserUpdate):
    id: UUID 
    user_name: str | None
    profile_image: str | None

    class Config:
        from_attributes = True   # (Pydantic v2)

class UserNameUpdate(BaseModel):
    user_name: str

    
# Request schema
class TextRequest(BaseModel):
    text: str
    max_length: int = 50
    min_length: int = 20
