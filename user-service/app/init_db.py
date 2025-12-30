import asyncio
from database import engine, Base
import models

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(init_db())
# This script initializes the database by creating all tables defined in the models.