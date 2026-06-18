from app.db.models import Base
from app.db.session import engine

async def init_models():
    async with engine.begin() as conn:
        # Create all metadata schemas
        await conn.run_sync(Base.metadata.create_all)
