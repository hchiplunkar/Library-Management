from sqlalchemy import Column, Integer, DateTime, func
from database import Base

class Reservation(Base):
    __tablename__ = "reservation"
    reservation_id = Column(Integer, primary_key=True)
    # store user id as plain Integer rather than a cross-service ForeignKey
    # to avoid referencing tables owned by another microservice
    user_id = Column(Integer)
    reservation_created_date = Column(DateTime, server_default=func.now())
    reservation_return_date = Column(DateTime, nullable=True)

class UserReservation(Base):
    __tablename__ = "user_reservation"
    reservation_id = Column(Integer, primary_key=True)
    book_id = Column(Integer, primary_key=True)
    book_return_date = Column(DateTime, nullable=True)
