from __future__ import annotations

import asyncio
import copy
from typing import AsyncGenerator
from uuid import uuid4

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings
from app.db.base import Base
from app.dependencies import get_db
from app.main import app
from app.models import AgentConfig, Doctor
from app.models.agent_config import DEFAULT_WORKING_HOURS
from app.core.security import create_access_token, hash_password

TEST_DATABASE_URL = settings.DATABASE_URL.replace(
    "/glork", "/glork_test"
) if "glork" in settings.DATABASE_URL else settings.DATABASE_URL + "_test"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await test_engine.dispose()


@pytest_asyncio.fixture
async def db() -> AsyncGenerator[AsyncSession, None]:
    async with TestSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def async_client(db: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def doctor(db: AsyncSession) -> Doctor:
    doc = Doctor(
        email=f"doctor_{uuid4().hex[:8]}@test.com",
        password_hash=hash_password("testpassword123"),
        name="Dr. Test",
        clinic_name="Test Clinic",
        specialty="General",
    )
    db.add(doc)
    await db.flush()

    config = AgentConfig(
        doctor_id=doc.id,
        working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS),
        greeting_message="Hello, Test Clinic here.",
    )
    db.add(config)
    await db.commit()
    await db.refresh(doc)
    return doc


@pytest_asyncio.fixture
async def auth_headers(doctor: Doctor) -> dict[str, str]:
    token = create_access_token({"sub": str(doctor.id)})
    return {"Authorization": f"Bearer {token}"}
