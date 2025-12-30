import reservation_pb2
import reservation_pb2_grpc
from models import Reservation, UserReservation
from repositories import ReservationRepository
from database import get_session
from opentelemetry import trace
from sqlalchemy import select

tracer = trace.get_tracer(__name__)

class ReservationService(reservation_pb2_grpc.ReservationServiceServicer):

    async def ReserveBook(self, request, context):
        with tracer.start_as_current_span("reserve_book"):
            async with get_session() as session:
                reservation = Reservation(user_id=request.user_id)
                await ReservationRepository.create_reservation(session, reservation)

                user_reservation = UserReservation(
                    reservation_id=reservation.reservation_id,
                    book_id=request.book_id
                )
                await ReservationRepository.create_user_reservation(session, user_reservation)

                # per reservation.proto, only reservation_id is returned
                return reservation_pb2.ReservationResponse(reservation_id=reservation.reservation_id)

    async def Returnbook(self, request, context):
        with tracer.start_as_current_span("return_book"):
            async with get_session() as session:
                reservation = await ReservationRepository.mark_return(session, request.reservation_id)
                if not reservation:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("Reservation not found")
                    return reservation_pb2.ReservationResponse()
                return reservation_pb2.ReservationResponse(reservation_id=reservation.reservation_id)

    async def DeleteReservation(self, request, context):
        with tracer.start_as_current_span("delete_reservation"):
            async with get_session() as session:
                reservation = await ReservationRepository.delete_reservation(session, request.reservation_id)
                if not reservation:
                    context.set_code(5)
                    context.set_details("Reservation not found")
                    return reservation_pb2.ReservationResponse()
                return reservation_pb2.ReservationResponse(reservation_id=reservation.reservation_id)

    async def GetReservation(self, request, context):
        with tracer.start_as_current_span("get_reservation"):
            async with get_session() as session:
                reservation = await ReservationRepository.get_reservation_by_id(session, request.reservation_id)
                if not reservation:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("Reservation not found")
                    return reservation_pb2.ReservationResponse()

                stmt = select(UserReservation).where(UserReservation.reservation_id == reservation.reservation_id)
                result = await session.execute(stmt)
                user_reservation = result.scalar_one_or_none()
                book_id = user_reservation.book_id if user_reservation else 0

                return reservation_pb2.ReservationResponse(
                    reservation_id=reservation.reservation_id,
                    user_id=reservation.user_id,
                    book_id=book_id,
                    reservation_created_date=str(reservation.reservation_created_date),
                    reservation_return_date=str(reservation.reservation_return_date) if reservation.reservation_return_date else ""
                )
