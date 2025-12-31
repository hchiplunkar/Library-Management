from sqlalchemy import select, join
from sqlalchemy.orm import aliased
from models import Reservation, UserReservation
from datetime import datetime
from types import SimpleNamespace

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

    @staticmethod
    async def get_all_reservations(session):
        # Simpler SQLAlchemy query: join Reservation with UserReservation
        # (don't assume user_member/book tables exist in this DB — keep service-responsibility small)

        r = aliased(Reservation)
        ur = aliased(UserReservation)

        stmt = (
            select(
                r.reservation_id.label("reservation_id"),
                r.user_id.label("user_id"),
                r.reservation_created_date.label("reservation_created_date"),
                r.reservation_return_date.label("reservation_return_date"),
                ur.book_id.label("book_id"),
                ur.book_return_date.label("book_return_date"),
            )
            .outerjoin(ur, ur.reservation_id == r.reservation_id)
            .order_by(r.reservation_id)
        )

        result = await session.execute(stmt)
        rows = result.mappings().all()

        out = []
        for row in rows:
            reservation_obj = SimpleNamespace(
                reservation_id=row.get("reservation_id"),
                user_id=row.get("user_id"),
                reservation_created_date=row.get("reservation_created_date"),
                reservation_return_date=row.get("reservation_return_date"),
            )

            agg = SimpleNamespace(
                reservation_id=row.get("reservation_id"),
                book_id=row.get("book_id") or 0,
                book_return_date=row.get("book_return_date"),
                user_name="",
                book_name="",
            )

            out.append((reservation_obj, agg))

        return out
