from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from app.db import get_async_session, User, Note
from app.schemas import NoteCreate, NoteResponse, NoteUpdate
from app.users import current_active_user

router = APIRouter()

# create note
@router.post("/", response_model=NoteResponse)
async def create_note(
    note_in: NoteCreate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    new_note = Note(user_id=user.id, title=note_in.title, tags=note_in.tags, content=note_in.content)
    session.add(new_note)
    await session.commit()
    await session.refresh(new_note)
    return new_note

# all notes 
@router.get("/", response_model=list[NoteResponse])
async def list_notes(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Note).where(Note.user_id == user.id))
    return result.scalars().all()

# individual notes 
@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: uuid.UUID,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

# delete note 
@router.delete("/{note_id}")
async def delete_note(
    note_id: uuid.UUID,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    await session.delete(note)
    await session.commit()
    return {"message": "Note deleted successfully"}

# update note 
@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: uuid.UUID,
    note_in: NoteUpdate,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user.id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Update only provided fields
    if note_in.title is not None:
        note.title = note_in.title
    if note_in.tags is not None:
        note.tags = note_in.tags
    if note_in.content is not None:
        note.content = note_in.content
        
    await session.commit()
    await session.refresh(note)
    return note
