from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Reservation(Base):
    __tablename__ = "reservation"
    reservation_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user_member.user_id"))
    reservation_created_date = Column(DateTime, server_default=func.now())
    reservation_return_date = Column(DateTime, nullable=True)

class UserReservation(Base):
    __tablename__ = "user_reservation"
    reservation_id = Column(Integer, ForeignKey("reservation.reservation_id"), primary_key=True)
    book_id = Column(Integer, ForeignKey("book.book_id"), primary_key=True)
    book_return_date = Column(DateTime, nullable=True)
