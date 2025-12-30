from sqlalchemy import select
from models import UserMember

class UserRepository:

    @staticmethod
    async def create(session, user: UserMember):
        session.add(user)
        return user

    @staticmethod
    async def get_by_id(session, user_id: int):
        stmt = select(UserMember).where(UserMember.user_id == user_id, UserMember.status == "ACTIVE")
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def soft_delete(session, user: UserMember):
        user.status = "DELETED"
        return user
