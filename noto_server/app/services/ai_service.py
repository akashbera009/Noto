import asyncio
import uuid
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from transformers import pipeline

from app.db import Note, Explanation, Summary
from app.schemas import ExplanationResponse, SummarizeResponse

# ==========================================
# 1. Local Models Initialization
# ==========================================
print("Loading local AI models (this may take a moment)...")
# Using local models for both summarize and explain tasks (as requested)
summarizer = pipeline("summarization", model="google/pegasus-xsum")

explainer = pipeline("text2text-generation", model="google/flan-t5-large")
print("Local AI models loaded successfully.")


# ==========================================
# 2. Service Logic
# ==========================================

async def refine_summary(summary: str) -> str:
    loop = asyncio.get_event_loop()

    prompt = f"""
    You are a professional writer.

    Rewrite the following summary in a more natural and human-friendly way.
    Improve clarity and flow.
    Do not shorten it too much.

    Summary:
    {summary}

    Improved Summary:
    """

    result = await loop.run_in_executor(
        None,
        lambda: explainer(
            prompt,
            max_length=150,
            min_length=40,
            do_sample=True
        )
    )

    return result[0]["generated_text"].strip()


async def handle_generate_summary(
    note_id: uuid.UUID,
    user_id: uuid.UUID,
    session: AsyncSession,
    regenerate: bool = False
): 
    result = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # 2. Check cache (unless regenerate=True)
    if not regenerate:
        cached = await session.execute(select(Summary).where(Summary.note_id == note.id))
        existing = cached.scalars().first()
        if existing:
            return SummarizeResponse(note=note.content, summary=existing.summary_text)

    # 3. If regenerate, delete old cached entry
    if regenerate:
        old = await session.execute(select(Summary).where(Summary.note_id == note.id))
        old_entry = old.scalars().first()
        if old_entry:
            await session.delete(old_entry)
            await session.commit()

    loop = asyncio.get_event_loop()

    # Step 1: raw summary
    raw_result = await loop.run_in_executor(
        None,
        lambda: summarizer(
            note.content,
            min_length=40,
            do_sample=False
        )
    )
    summary = raw_result[0]["summary_text"]

    # Step 2: refine it
    refined_summary = await refine_summary(summary)

    # 4. Save to cache
    new_summary = Summary(note_id=note.id, summary_text=refined_summary)
    session.add(new_summary)
    await session.commit()

    return SummarizeResponse(note=note.content, summary=refined_summary)


async def _invoke_local_explainer(content: str, mode: str) -> str:
    """
    Runs the FLAN-T5 instruction model for explanation.
    """
    
    if mode == "simple":
        prompt = f"""
    You are a helpful teacher.

    Explain the following in very simple terms so that a beginner can understand.
    Use short sentences and avoid complex jargon.

    Text:
    {content}

    Simple Explanation:
    """
    else:
        prompt = f"""
        You are an expert teacher.

        Explain the following in a detailed and technical way.
        Break down the important concepts clearly.

        Text:
        {content}

        Technical Explanation:
        """
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        lambda: explainer(
            prompt,
            min_length=80,
            max_length=150,
            do_sample=True
        )
    )

    # ✅ FLAN-T5 returns clean output (no need to strip prompt)
    return result[0]["generated_text"].strip()

async def handle_explain_note(
    note_id: uuid.UUID,
    mode: str,
    user_id: uuid.UUID,
    session: AsyncSession,
    regenerate: bool = False
) -> ExplanationResponse:
    """
    Core business logic for explaining a note.
    This handles DB validation, caching, and model invocation.
    """
    
    # 1. Validate Note belongs to user
    result = await session.execute(select(Note).where(Note.id == note_id, Note.user_id == user_id))
    
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if mode not in ["simple", "technical"]:
        raise HTTPException(status_code=400, detail="Invalid mode: must be 'simple' or 'technical'")

    # 2. Check if explanation already exists (Caching mechanism)
    if not regenerate:
        exp_result = await session.execute(
            select(Explanation).where(Explanation.note_id == note.id, Explanation.mode == mode)
        )
        existing_explanation = exp_result.scalars().first()
        if existing_explanation:
            return ExplanationResponse(
                note=note.content,
                explanation=existing_explanation.explanation_text,
                mode=mode
            )

    # 3. If regenerate, delete old cached entry
    if regenerate:
        old = await session.execute(
            select(Explanation).where(Explanation.note_id == note.id, Explanation.mode == mode)
        )
        old_entry = old.scalars().first()
        if old_entry:
            await session.delete(old_entry)
            await session.commit()


    # 4. Generate via local AI
    explanation_text = await _invoke_local_explainer(note.content, mode)

    # 5. Save cache to DB
    new_explanation = Explanation(note_id=note.id, mode=mode, explanation_text=explanation_text)
    session.add(new_explanation)
    await session.commit()
    
    return ExplanationResponse(
        note=note.content,
        explanation=explanation_text,
        mode=mode
    )