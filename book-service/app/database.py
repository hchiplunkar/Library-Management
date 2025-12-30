from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from contextlib import asynccontextmanager
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.asyncpg import AsyncPGInstrumentor
from common.telemetry import setup_tracing

DATABASE_URL = "postgresql+asyncpg://myuser:mypassword@postgres:5432/library"

tracer = setup_tracing("book-service")

engine = create_async_engine(DATABASE_URL, echo=False)
SQLAlchemyInstrumentor().instrument(engine=engine.sync_engine)
AsyncPGInstrumentor().instrument()

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

@asynccontextmanager
async def get_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
