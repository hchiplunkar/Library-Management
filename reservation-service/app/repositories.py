from sqlalchemy import select
from models import Reservation, UserReservation

class ReservationRepository:

    @staticmethod
    async def create_reservation(session, reservation: Reservation):
        session.add(reservation)
        return reservation

    @staticmethod
    async def create_user_reservation(session, user_reservation: UserReservation):
        session.add(user_reservation)
        return user_reservation

    @staticmethod
    async def get_reservation_by_id(session, reservation_id: int):
        stmt = select(Reservation).where(Reservation.reservation_id == reservation_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
