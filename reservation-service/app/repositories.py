from sqlalchemy import select
from models import Reservation, UserReservation
from datetime import datetime

class ReservationRepository:

    @staticmethod
    async def create_reservation(session, reservation: Reservation):
        session.add(reservation)
        await session.flush()
        return reservation

    @staticmethod
    async def create_user_reservation(session, user_reservation: UserReservation):
        session.add(user_reservation)
        await session.flush()
        return user_reservation

    @staticmethod
    async def mark_return(session, reservation_id: int):
        stmt = select(Reservation).where(Reservation.reservation_id == reservation_id)
        result = await session.execute(stmt)
        reservation = result.scalar_one_or_none()
        if not reservation:
            return None
        reservation.reservation_return_date = datetime.utcnow()
        await session.flush()
        return reservation

    @staticmethod
    async def delete_reservation(session, reservation_id: int):
        stmt = select(Reservation).where(Reservation.reservation_id == reservation_id)
        result = await session.execute(stmt)
        reservation = result.scalar_one_or_none()
        if not reservation:
            return None

        # delete related UserReservation rows
        stmt2 = select(UserReservation).where(UserReservation.reservation_id == reservation_id)
        res2 = await session.execute(stmt2)
        user_res = res2.scalars().all()
        for ur in user_res:
            await session.delete(ur)

        await session.delete(reservation)
        await session.flush()
        return reservation

    @staticmethod
    async def get_reservation_by_id(session, reservation_id: int):
        stmt = select(Reservation).where(Reservation.reservation_id == reservation_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
