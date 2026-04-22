from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.db import get_async_session, User
from app.schemas import ExplainRequest, ExplanationResponse, SummarizeResponse, TextRequest
from app.users import current_active_user
from app.services.ai_service import handle_explain_note, handle_generate_summary

router = APIRouter()

@router.post("/explain/{note_id}", response_model=ExplanationResponse)
async def explain_note(
    note_id: uuid.UUID,
    request_in: ExplainRequest,
    regenerate: bool = Query(default=False, description="Set to true to bypass cache and regenerate a fresh summary"),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Controller route for explaining a note.
    All business and formatting logic resides in ai_service.py.
    """
    return await handle_explain_note(
        note_id=note_id,
        mode=request_in.mode,
        user_id=user.id,
        session=session,
        regenerate=regenerate
    )

@router.post("/summarize/{note_id}" , response_model=SummarizeResponse)
async def summarize( 
    note_id: uuid.UUID,
    regenerate: bool = Query(default=False, description="Set to true to bypass cache and regenerate a fresh summary"),
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Controller route for summarizing a note.
    Pass ?regenerate=true to bypass cache and generate a fresh summary.
    """
    return await handle_generate_summary(
        note_id=note_id,
        user_id=user.id,
        session=session,
        regenerate=regenerate
    )
