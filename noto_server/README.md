# ⚙️ Noto Backend Server

The powerhouse behind Noto, this backend is built with **FastAPI** and handles all data management, authentication, and heavy-duty AI processing.

## 🔥 Core Capabilities

- **AI Engine**: Local execution of Hugging Face models for summarization (`Pegasus`) and explanations (`FLAN-T5`).
- **Asynchronous API**: High-performance endpoints built with Python's `asyncio`.
- **Database Architecture**: Flexible storage using SQLAlchemy and Alembic migrations.
- **Authentication**: Secure JWT-based user management.

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: SQLAlchemy (Async)
- **Migrations**: Alembic
- **AI Models**: Transformers (Hugging Face)

## 🚀 Quick Start

### Installation

1. **Activate Environment**:
   ```bash
   source ../venv/bin/activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r ../requirement.txt
   ```

3. **Run Migrations**:
   ```bash
   alembic upgrade head
   ```

### Running the Server

```bash
uvicorn main:app --reload
```

The API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤖 AI Models Configuration

The server automatically downloads and caches the necessary models on the first run.
- **Summarization**: `google/pegasus-xsum`
- **Explanations**: `google/flan-t5-large`

---

*Part of the [Noto Project](../README.md).*
