from sqlalchemy import Column, Integer, String, DateTime, func, Index
from database import Base

class UserMember(Base):
    __tablename__ = "user_member"

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String(100), nullable=False)
    email_id = Column(String(150), nullable=False, unique=True)
    contactno = Column(String(20))
    address = Column(String(255))
    aadhar_id = Column(String(20), unique=True)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

Index("idx_user_email", UserMember.email_id)
Index("idx_user_status", UserMember.status)
