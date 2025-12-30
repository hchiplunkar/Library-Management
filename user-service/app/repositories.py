from sqlalchemy import select
from models import UserMember

class UserRepository:

    @staticmethod
    async def create(session, user: UserMember):
        session.add(user)
        await session.flush()
        return user

    @staticmethod
    async def get_by_id(session, user_id: int):
        stmt = select(UserMember).where(UserMember.user_id == user_id, UserMember.status == "ACTIVE")
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_users(session):
        stmt = select(UserMember).where(UserMember.status == "ACTIVE")
        result = await session.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def soft_delete(session, user: UserMember):
        user.status = "DELETED"
        await session.flush()
        return user

    @staticmethod
    async def update_user(session, user_id: int, **fields):
        stmt = select(UserMember).where(UserMember.user_id == user_id, UserMember.status == "ACTIVE")
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            return None
        for k, v in fields.items():
            if hasattr(user, k) and v is not None:
                setattr(user, k, v)
        await session.flush()
        return user
