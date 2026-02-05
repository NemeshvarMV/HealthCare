# Weekly recurring availability model

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postsql%40123@localhost/healthcare')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)

# Doctor model
class Doctor(Base):
    __tablename__ = 'doctors'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    timings = Column(String, nullable=True)  # e.g., "Mon-Fri 10am-4pm"
    fees = Column(String, nullable=True)     # e.g., "500"
    clinic_address = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)


# Availability model
class Availability(Base):
    __tablename__ = 'availabilities'
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

Base.metadata.create_all(bind=engine)

# Appointment model
class Appointment(Base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    patient_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(String, default='pending')  # pending, confirmed, cancelled, completed
    video_call_link = Column(String, nullable=True)  # Telemedicine link
    appointment_type = Column(String, default='in-person')  # 'in-person' or 'online'

class WeeklyAvailability(Base):
    __tablename__ = 'weekly_availabilities'
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String, nullable=False)    # '09:00'
    end_time = Column(String, nullable=False)      # '13:00'