import book_pb2
import book_pb2_grpc
from models import Book
from repositories import BookRepository
from database import get_session
from opentelemetry import trace
from collections import defaultdict
from utils import map_to_proto

tracer = trace.get_tracer(__name__)

class BookService(book_pb2_grpc.BookServiceServicer):

    async def AddBook(self, request, context):
        with tracer.start_as_current_span("add_book"):
            async with get_session() as session:
                book = Book(
                    book_name=request.book_name,
                    category_id=request.category_id
                )
                await BookRepository.create(session, book)
                return book_pb2.BookResponse(
                    book_id=book.book_id,
                    book_name=book.book_name,
                    category_id=book.category_id
                )

    async def GetBook(self, request, context):
        with tracer.start_as_current_span("get_book"):
            async with get_session() as session:
                book = await BookRepository.get_by_id(session, request.book_id)
                if not book:
                    context.set_code(5)  # NOT_FOUND
                    context.set_details("Book not found")
                    return book_pb2.BookResponse()
                return book_pb2.BookResponse(
                    book_id=book.book_id,
                    book_name=book.book_name,
                    category_id=book.category_id
                )
            
    async def GetAllBooks(self, request, context):
        with tracer.start_as_current_span("get_all_books"):
            async with get_session() as session:
                rows = await BookRepository.get_all_books(session)
                response = map_to_proto(rows)
                return response

    
