from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Many-to-many
book_publisher_table = Table(
    "book_publisher", Base.metadata,
    Column("book_id", ForeignKey("book.book_id"), primary_key=True),
    Column("publisher_id", ForeignKey("publisher.publisher_id"), primary_key=True)
)

book_authors_table = Table(
    "book_authors", Base.metadata,
    Column("book_id", ForeignKey("book.book_id"), primary_key=True),
    Column("author_id", ForeignKey("author.author_id"), primary_key=True)
)

class Book(Base):
    __tablename__ = "book"
    book_id = Column(Integer, primary_key=True)
    book_name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("category.category_id"))
    publishers = relationship("Publisher", secondary=book_publisher_table, back_populates="books")
    authors = relationship("Author", secondary=book_authors_table, back_populates="books")

class Publisher(Base):
    __tablename__ = "publisher"
    publisher_id = Column(Integer, primary_key=True)
    publisher_name = Column(String(255), nullable=False)
    books = relationship("Book", secondary=book_publisher_table, back_populates="publishers")

class Author(Base):
    __tablename__ = "author"
    author_id = Column(Integer, primary_key=True)
    author_name = Column(String(255), nullable=False)
    books = relationship("Book", secondary=book_authors_table, back_populates="authors")

class Category(Base):
    __tablename__ = "category"
    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(100), nullable=False)
