from sqlalchemy.orm import aliased
from sqlalchemy import select, join, func
from models import Book, Author, Publisher, Category, book_publisher_table, book_authors_table
import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
console = logging.getLogger("book-repository")

class BookRepository:

    @staticmethod
    async def create(session, book: Book):
        session.add(book)
        return book

    @staticmethod
    async def get_by_id(session, book_id: int):
        stmt = select(Book).where(Book.book_id == book_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_books(session):
        console.info("Fetching all books with related data")
        b = aliased(Book)
        c = aliased(Category)
        a = aliased(Author)
        p = aliased(Publisher)

        stmt = (
            select(
                b.book_id,
                b.book_name,
                c.category_name,
                func.array_agg(func.distinct(a.author_name)).label("authors"),
                func.array_agg(func.distinct(p.publisher_name)).label("publishers"),
            )
            .join(c, b.category_id == c.category_id)
            .join(book_authors_table, b.book_id == book_authors_table.c.book_id)
            .join(a, book_authors_table.c.author_id == a.author_id)
            .join(book_publisher_table, b.book_id == book_publisher_table.c.book_id)
            .join(p, book_publisher_table.c.publisher_id == p.publisher_id)
            .group_by(b.book_id, b.book_name, c.category_name)
        )
        result = await session.execute(stmt)
        return result.all()
 