import asyncio
import aiohttp
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
                # Defensive validation in the service as well
                if not getattr(request, "user_id", None) or not getattr(request, "book_id", None):
                    context.set_code(3)  # INVALID_ARGUMENT
                    context.set_details("user_id and book_id are required")
                    return reservation_pb2.ReservationResponse()

                user_id = int(request.user_id)
                book_id = int(request.book_id)

                # Validate existence of user and book by calling the API gateway
                gateway_url = "http://api-gateway:8080"

                async def fetch(path):
                    try:
                        timeout = aiohttp.ClientTimeout(total=5)
                        async with aiohttp.ClientSession(timeout=timeout) as sess:
                            resp = await sess.get(f"{gateway_url}{path}")
                            return resp
                    except Exception as e:
                        return e

                user_path = f"/users/{user_id}"
                book_path = f"/books/{book_id}"

                results = await asyncio.gather(fetch(user_path), fetch(book_path))

                # Check user result
                user_res = results[0]
                if isinstance(user_res, Exception):
                    context.set_code(14)  # UNAVAILABLE
                    context.set_details("user-service (via API gateway) unavailable")
                    return reservation_pb2.ReservationResponse()
                if user_res.status == 404 or user_res.status >= 400:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("user not found")
                    return reservation_pb2.ReservationResponse()

                # Check book result
                book_res = results[1]
                if isinstance(book_res, Exception):
                    context.set_code(14)  # UNAVAILABLE
                    context.set_details("book-service (via API gateway) unavailable")
                    return reservation_pb2.ReservationResponse()
                if book_res.status == 404 or book_res.status >= 400:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("book not found")
                    return reservation_pb2.ReservationResponse()

                # all validations passed — create reservation
                reservation = Reservation(user_id=user_id)
                await ReservationRepository.create_reservation(session, reservation)

                user_reservation = UserReservation(
                    reservation_id=reservation.reservation_id,
                    book_id=book_id
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

    async def GetAllReservations(self, request, context):
        with tracer.start_as_current_span("get_all_reservations"):
            async with get_session() as session:
                rows = await ReservationRepository.get_all_reservations(session)

                # Build a simple mapped list and collect unique user/book ids
                mapped = []
                user_ids = set()
                book_ids = set()
                for reservation, user_res in rows:
                    bid = user_res.book_id if user_res else 0
                    mapped.append({
                        "reservation_id": reservation.reservation_id,
                        "user_id": reservation.user_id,
                        "user_name": "",
                        "book_id": bid,
                        "book_name": "",
                    })
                    if reservation.user_id:
                        user_ids.add(int(reservation.user_id))
                    if bid:
                        book_ids.add(int(bid))

                # Call API gateway to fetch user and book details in parallel
                gateway_url = "http://api-gateway:8080"
                async def fetch_many(paths):
                    results = {}
                    timeout = aiohttp.ClientTimeout(total=5)
                    async with aiohttp.ClientSession(timeout=timeout) as sess:
                        coros = [sess.get(f"{gateway_url}{p}") for p in paths]
                        responses = await asyncio.gather(*coros, return_exceptions=True)
                        for p, r in zip(paths, responses):
                            results[p] = r
                    return results

                user_paths = [f"/users/{uid}" for uid in user_ids]
                book_paths = [f"/books/{bid}" for bid in book_ids]

                users_map = {}
                books_map = {}
                try:
                    user_results = await fetch_many(user_paths) if user_paths else {}
                    book_results = await fetch_many(book_paths) if book_paths else {}

                    # parse user responses
                    for path, resp in user_results.items():
                        if isinstance(resp, Exception) or getattr(resp, "status", 500) >= 400:
                            users_map[int(path.rsplit("/", 1)[1])] = None
                            continue
                        try:
                            data = await resp.json()
                        except Exception:
                            users_map[int(path.rsplit("/", 1)[1])] = None
                            continue
                        # Heuristically extract a name field
                        name = None
                        if isinstance(data, dict):
                            name = data.get("name") or data.get("user_name") or data.get("user") and data.get("user").get("name")
                        users_map[int(path.rsplit("/", 1)[1])] = name or None

                    # parse book responses
                    for path, resp in book_results.items():
                        if isinstance(resp, Exception) or getattr(resp, "status", 500) >= 400:
                            books_map[int(path.rsplit("/", 1)[1])] = None
                            continue
                        try:
                            data = await resp.json()
                        except Exception:
                            books_map[int(path.rsplit("/", 1)[1])] = None
                            continue
                        bname = None
                        if isinstance(data, dict):
                            # Common shapes: { book: { book_name: ... } } or { book_name: ... }
                            if "book" in data and isinstance(data.get("book"), dict):
                                bname = data["book"].get("book_name") or data["book"].get("name")
                            bname = bname or data.get("book_name") or data.get("name")
                        books_map[int(path.rsplit("/", 1)[1])] = bname or None
                except Exception:
                    # On any error, leave names blank — do not fail the whole call
                    users_map = {}
                    books_map = {}

                # Build proto response items using maps
                resp_items = []
                for m in mapped:
                    uid = int(m["user_id"]) if m["user_id"] else 0
                    bid = int(m["book_id"]) if m["book_id"] else 0
                    user_name = users_map.get(uid) if uid else ""
                    book_name = books_map.get(bid) if bid else ""
                    item = reservation_pb2.Reservation_details(
                        reservation_id=m["reservation_id"],
                        user_id=m["user_id"],
                        user_name=user_name or "",
                        book_id=m["book_id"],
                        book_name=book_name or ""
                    )
                    resp_items.append(item)

                return reservation_pb2.GetAllReservResponse(Reservation=resp_items)
