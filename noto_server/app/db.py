from collections.abc import AsyncGenerator
import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, event
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker 
from sqlalchemy.orm import DeclarativeBase, relationship
from datetime import datetime
# from fastapi_users.db import SQLAlchemyUserDatabase,SQLAlchemyBaseUserTableUUID
from fastapi_users_db_sqlalchemy import (
    SQLAlchemyUserDatabase,
    SQLAlchemyBaseUserTableUUID,
)
from fastapi import Depends

DATABASE_URL= 'sqlite+aiosqlite:///./test.db'

class Base(DeclarativeBase):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):  # ont-to-many relations
    __tablename__ = 'users'

    user_name = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)

    notes = relationship("Note", back_populates="user")

class Note(Base):
    __tablename__ = 'notes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=True)
    tags = Column(JSON, nullable=False, default=list)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="notes")
    explanations = relationship("Explanation", back_populates="note", cascade="all, delete")
    summaries = relationship("Summary", back_populates="note", cascade="all, delete")

class Explanation(Base):
    __tablename__ = 'explanations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    note_id = Column(UUID(as_uuid=True), ForeignKey("notes.id"), nullable=False)
    mode = Column(String, nullable=False)
    explanation_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    note = relationship("Note", back_populates="explanations")

class Summary(Base):
    __tablename__ = 'summaries'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    note_id = Column(UUID(as_uuid=True), ForeignKey("notes.id"), nullable=False)
    summary_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    note = relationship("Note", back_populates="summaries")

engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30
)

# Enable WAL mode for SQLite to improve concurrency
@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.close()

async_sessionmaker = async_sessionmaker(engine, expire_on_commit=False)

async def create_db_and_tables():
    async with engine.begin() as conn:
        # find all the classed inherited from Base and create them inside the database
        await conn.run_sync(Base.metadata.create_all)  

# create a async session with database which will allow us from writing and reading from database 
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_sessionmaker() as session:
        yield session
        # await session.close()


# get user
async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User) 