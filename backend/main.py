# Pydantic model for patient update

# Get the logged-in patient's full profile
from jose import JWTError

# ...existing code...

# Patient profile endpoint

# Update the logged-in doctor's profile
from pydantic import BaseModel


# Get the logged-in doctor's full profile
from fastapi import status
from fastapi.responses import JSONResponse


# List all booked appointments for the logged-in doctor

# List all doctors (for patient booking UI)

# --- Patient Appointment Booking Using Weekly Availability ---
from datetime import time, timedelta



from fastapi.responses import StreamingResponse
import io
# PDF report endpoint

# Generate report endpoint

import requests
from fastapi import Request
from fastapi.responses import JSONResponse
from secret_config import GEMINI_API_KEY
# Chatbot endpoint (Gemini API integration)

import joblib 
from fastapi import Body, Request
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
import os
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Database integration
from db import SessionLocal, User as DBUser, Doctor as DBDoctor, Availability as DBAvailability, WeeklyAvailability as DBWeeklyAvailability, Appointment
# Pydantic model for weekly availability
from typing import List
class WeeklyAvailabilitySlot(BaseModel):
    day_of_week: int  # 0=Monday, 6=Sunday
    start_time: str   # '09:00'
    end_time: str     # '13:00'

# Add a weekly availability slot
@app.post("/doctor/weekly-availability")
def add_weekly_availability(slot: WeeklyAvailabilitySlot, token: str = Depends(oauth2_scheme)):
    try:
        print("[DEBUG] Entered endpoint: /doctor/weekly-availability [POST]")
        print(f"[DEBUG] Slot received: day_of_week={slot.day_of_week}, start_time={slot.start_time}, end_time={slot.end_time}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        print(f"[DEBUG] Token decoded: email={email}, role={role}")
        if role != "doctor":
            print("[DEBUG] Forbidden: Only doctors can add weekly availability.")
            raise HTTPException(status_code=403, detail="Only doctors can add weekly availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        print(f"[DEBUG] Doctor lookup: {doctor}")
        if doctor:
            print(f"[DEBUG] Adding slot for doctor_id={doctor.id}, email={doctor.email}, slot={slot}")
        if not doctor:
            print("[DEBUG] Doctor not found.")
            raise HTTPException(status_code=404, detail="Doctor not found.")
        # Check for overlapping slots for the same doctor and day
        overlapping = db.query(DBWeeklyAvailability).filter(
            DBWeeklyAvailability.doctor_id == doctor.id,
            DBWeeklyAvailability.day_of_week == slot.day_of_week,
            DBWeeklyAvailability.start_time < slot.end_time,
            DBWeeklyAvailability.end_time > slot.start_time
        ).first()
        if overlapping:
            print("[DEBUG] Overlapping slot detected.")
            raise HTTPException(status_code=400, detail="Overlapping weekly slot exists for this day.")
        new_slot = DBWeeklyAvailability(
            doctor_id=doctor.id,
            day_of_week=slot.day_of_week,
            start_time=slot.start_time,
            end_time=slot.end_time
        )
        print("[DEBUG] New WeeklyAvailability instance created.")
        db.add(new_slot)
        print("[DEBUG] Added new_slot to session.")
        db.flush()  # Ensure the slot is written to the DB before commit
        print(f"[DEBUG] Flushed new_slot: id={getattr(new_slot, 'id', None)}")
        db.refresh(new_slot)
        print(f"[DEBUG] Refreshed new_slot: id={new_slot.id}")
        db.commit()
        print("[DEBUG] Committed new_slot to DB.")
        return {"msg": "Weekly availability slot added", "id": new_slot.id}
    except Exception as e:
        import traceback
        print("[ERROR] Exception in add_weekly_availability:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# List all weekly availability slots for the logged-in doctor
@app.get("/doctor/weekly-availability")
def list_weekly_availability(token: str = Depends(oauth2_scheme)):
    try:
        print("[DEBUG] Entered endpoint: /doctor/weekly-availability [GET]")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        print(f"[DEBUG] Token decoded: email={email}, role={role}")
        if role != "doctor":
            print("[DEBUG] Forbidden: Only doctors can view weekly availability.")
            raise HTTPException(status_code=403, detail="Only doctors can view weekly availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        print(f"[DEBUG] Doctor lookup: {doctor}")
        if doctor:
            print(f"[DEBUG] Listing slots for doctor_id={doctor.id}, email={doctor.email}")
        if not doctor:
            print("[DEBUG] Doctor not found.")
            raise HTTPException(status_code=404, detail="Doctor not found.")
        slots = db.query(DBWeeklyAvailability).filter(DBWeeklyAvailability.doctor_id == doctor.id).all()
        print(f"[DEBUG] Slots found: {slots}")
        return [{"id": s.id, "day_of_week": s.day_of_week, "start_time": s.start_time, "end_time": s.end_time} for s in slots]
    except Exception as e:
        import traceback
        print("[ERROR] Exception in list_weekly_availability:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# Update a weekly availability slot
@app.put("/doctor/weekly-availability/{slot_id}")
def update_weekly_availability(slot_id: int, slot: WeeklyAvailabilitySlot, token: str = Depends(oauth2_scheme)):
    try:
        print("[DEBUG] Entered endpoint: /doctor/weekly-availability [PUT]")
        print(f"[DEBUG] Slot update: id={slot_id}, day_of_week={slot.day_of_week}, start_time={slot.start_time}, end_time={slot.end_time}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        print(f"[DEBUG] Token decoded: email={email}, role={role}")
        if role != "doctor":
            print("[DEBUG] Forbidden: Only doctors can update weekly availability.")
            raise HTTPException(status_code=403, detail="Only doctors can update weekly availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        print(f"[DEBUG] Doctor lookup: {doctor}")
        if not doctor:
            print("[DEBUG] Doctor not found.")
            raise HTTPException(status_code=404, detail="Doctor not found.")
        avail = db.query(DBWeeklyAvailability).filter(DBWeeklyAvailability.id == slot_id, DBWeeklyAvailability.doctor_id == doctor.id).first()
        print(f"[DEBUG] Slot to update: {avail}")
        if not avail:
            print("[DEBUG] Weekly availability slot not found.")
            raise HTTPException(status_code=404, detail="Weekly availability slot not found.")
        # Check for overlapping slots (excluding the current slot)
        overlapping = db.query(DBWeeklyAvailability).filter(
            DBWeeklyAvailability.doctor_id == doctor.id,
            DBWeeklyAvailability.day_of_week == slot.day_of_week,
            DBWeeklyAvailability.start_time < slot.end_time,
            DBWeeklyAvailability.end_time > slot.start_time,
            DBWeeklyAvailability.id != slot_id
        ).first()
        if overlapping:
            print("[DEBUG] Overlapping slot detected on update.")
            raise HTTPException(status_code=400, detail="Overlapping weekly slot exists for this day.")
        avail.day_of_week = slot.day_of_week
        avail.start_time = slot.start_time
        avail.end_time = slot.end_time
        db.commit()
        print("[DEBUG] Slot updated and committed.")
        return {"msg": "Weekly availability slot updated"}
    except Exception as e:
        import traceback
        print("[ERROR] Exception in update_weekly_availability:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# Delete a weekly availability slot
@app.delete("/doctor/weekly-availability/{slot_id}")
def delete_weekly_availability(slot_id: int, token: str = Depends(oauth2_scheme)):
    try:
        print("[DEBUG] Entered endpoint: /doctor/weekly-availability [DELETE]")
        print(f"[DEBUG] Slot delete: id={slot_id}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        print(f"[DEBUG] Token decoded: email={email}, role={role}")
        if role != "doctor":
            print("[DEBUG] Forbidden: Only doctors can delete weekly availability.")
            raise HTTPException(status_code=403, detail="Only doctors can delete weekly availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        print(f"[DEBUG] Doctor lookup: {doctor}")
        if not doctor:
            print("[DEBUG] Doctor not found.")
            raise HTTPException(status_code=404, detail="Doctor not found.")
        avail = db.query(DBWeeklyAvailability).filter(DBWeeklyAvailability.id == slot_id, DBWeeklyAvailability.doctor_id == doctor.id).first()
        print(f"[DEBUG] Slot to delete: {avail}")
        if not avail:
            print("[DEBUG] Weekly availability slot not found.")
            raise HTTPException(status_code=404, detail="Weekly availability slot not found.")
        db.delete(avail)
        db.commit()
        print("[DEBUG] Slot deleted and committed.")
        return {"msg": "Weekly availability slot deleted"}
    except Exception as e:
        import traceback
        print("[ERROR] Exception in delete_weekly_availability:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# Pydantic model for availability
class AvailabilitySlot(BaseModel):
    start_time: datetime
    end_time: datetime

# Add availability slot
@app.post("/doctor/availability")
def add_availability(slot: AvailabilitySlot, token: str = Depends(oauth2_scheme)):
    """Doctor adds a new available time slot."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can add availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        new_slot = DBAvailability(doctor_id=doctor.id, start_time=slot.start_time, end_time=slot.end_time)
        db.add(new_slot)
        db.commit()
        db.refresh(new_slot)
        return {"msg": "Availability slot added", "id": new_slot.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# List all availability slots for the logged-in doctor
@app.get("/doctor/availability")
def list_availability(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can view availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        slots = db.query(DBAvailability).filter(DBAvailability.doctor_id == doctor.id).all()
        return [{"id": s.id, "start_time": s.start_time, "end_time": s.end_time} for s in slots]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# Update an availability slot
@app.put("/doctor/availability/{slot_id}")
def update_availability(slot_id: int, slot: AvailabilitySlot, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can update availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        avail = db.query(DBAvailability).filter(DBAvailability.id == slot_id, DBAvailability.doctor_id == doctor.id).first()
        if not avail:
            raise HTTPException(status_code=404, detail="Availability slot not found.")
        avail.start_time = slot.start_time
        avail.end_time = slot.end_time
        db.commit()
        return {"msg": "Availability slot updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

# Delete an availability slot
@app.delete("/doctor/availability/{slot_id}")
def delete_availability(slot_id: int, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can delete availability.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        avail = db.query(DBAvailability).filter(DBAvailability.id == slot_id, DBAvailability.doctor_id == doctor.id).first()
        if not avail:
            raise HTTPException(status_code=404, detail="Availability slot not found.")
        db.delete(avail)
        db.commit()
        return {"msg": "Availability slot deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()
from sqlalchemy.orm import Session



# User registration model
import random

class User(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str  # 'patient' or 'doctor'
    phone_number: str

# Doctor registration model
class DoctorRegister(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    specialization: str
    clinic_address: str = "123 Main St, City"
    phone_number: str = "555-123-4567"

# Doctor registration endpoint
@app.post("/register_doctor")
def register_doctor(doctor: DoctorRegister):
    logging.info(f"Doctor register attempt: {doctor.email}")
    db: Session = SessionLocal()
    try:
        existing = db.query(DBDoctor).filter(DBDoctor.email == doctor.email).first()
        if existing:
            logging.warning(f"Doctor email already registered: {doctor.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        if len(doctor.password) > 72:
            logging.error(f"Password too long for {doctor.email}: {len(doctor.password)} characters")
            raise HTTPException(status_code=400, detail="Password cannot be longer than 72 characters.")
        # Enforce required fields
        if not doctor.clinic_address or not doctor.clinic_address.strip():
            raise HTTPException(status_code=400, detail="Clinic address is required.")
        if not doctor.phone_number or not doctor.phone_number.strip():
            raise HTTPException(status_code=400, detail="Phone number is required.")
        hashed_password = get_password_hash(doctor.password)
        db_doctor = DBDoctor(
            email=doctor.email,
            full_name=doctor.full_name,
            hashed_password=hashed_password,
            specialization=doctor.specialization,
            clinic_address=doctor.clinic_address.strip(),
            phone_number=doctor.phone_number.strip()
        )
        db.add(db_doctor)
        db.commit()
        db.refresh(db_doctor)
        logging.info(f"Doctor registration successful: {doctor.email}")
        return {"msg": "Doctor registration successful"}
    except Exception as e:
        db.rollback()
        logging.error(f"Doctor registration failed for {doctor.email}: {e}")
        raise HTTPException(status_code=500, detail="Doctor registration failed")
    finally:
        db.close()

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
# Load ML model and scaler at startup
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "fibromyalgia_rf_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

# Use global variables for model and scaler

@app.on_event("startup")
def load_model_and_scaler():
    try:
        app.state.fibromyalgia_model = joblib.load(MODEL_PATH)
        app.state.scaler = joblib.load(SCALER_PATH)
        logging.info("ML model and scaler loaded successfully.")
    except Exception as e:
        app.state.fibromyalgia_model = None
        app.state.scaler = None
        logging.error(f"Failed to load ML model or scaler: {e}")

# Pydantic model for prediction input

# Update input model to match your features

# Match Flask input logic
class FibromyalgiaInput(BaseModel):
    age: float
    sex: int
    ses: float
    csi: float
    sps: float
    sat: float

# Prediction endpoint
@app.post("/predict_fibromyalgia")
def predict_fibromyalgia(input_data: FibromyalgiaInput):
    try:
        import joblib
        import numpy as np
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        MODEL_PATH = os.path.join(BASE_DIR, "models", "fibromyalgia_rf_model.pkl")
        SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        features = np.array([[input_data.age, input_data.sex, input_data.ses, input_data.csi, input_data.sps, input_data.sat]])
        input_scaled = scaler.transform(features)
        prob = model.predict_proba(input_scaled)[0][1]
        prob = float(prob)
        probability = round(prob * 100, 2)
        if prob < 0.4:
            result = {"label": "Low Risk", "icon": "bi bi-shield-check text-success"}
        elif prob < 0.7:
            result = {"label": "Medium Risk", "icon": "bi bi-exclamation-triangle text-warning"}
        else:
            result = {"label": "High Risk", "icon": "bi bi-shield-x text-danger"}
        return {"result": result, "probability": probability}
    except Exception as e:
        import traceback
        logging.error(f"Prediction error: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
    
@app.post("/generate_report")
def generate_report(data: dict):
    # Example: Compose a simple report from prediction and input
    risk = data.get("result")
    risk_label = risk["label"] if isinstance(risk, dict) else risk
    report = {
        "title": "Fibromyalgia Prediction Report",
        "fields": {
            "Age": data.get("age"),
            "Sex": "Male" if data.get("sex") == 1 else "Female",
            "SES": data.get("ses"),
            "CSI": data.get("csi"),
            "SPS": data.get("sps"),
            "SAT": data.get("sat"),
            "Risk Level": risk_label,
            "Probability": f"{data.get('probability')}%"
        },
        "summary": f"Based on your responses, your risk level is {risk_label} with a probability of {data.get('probability')}%. This report is for educational purposes only and does not replace professional medical advice."
    }
    return JSONResponse(report)

@app.post("/download_report")
def download_report(data: dict):
    print("[DEBUG] PDF report data received:", data)
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from datetime import datetime
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    # Centered Health care title
    p.setFont("Helvetica-Bold", 20)
    p.drawCentredString(width / 2, height - 60, "Health care")
    # Report title
    p.setFont("Helvetica-Bold", 15)
    p.drawString(72, height - 100, "Fibromyalgia Prediction Report")
    # Patient info
    p.setFont("Helvetica", 12)
    y = height - 140
    patient_name = data.get("full_name") or data.get("name") or "-"
    patient_email = data.get("email") or "-"
    today = datetime.now().strftime("%A, %d %B %Y")
    p.drawString(72, y, f"Patient Name: {patient_name}")
    y -= 22
    p.drawString(72, y, f"Patient Email: {patient_email}")
    y -= 22
    p.drawString(72, y, f"Date: {today}")
    y -= 32
    # Report fields
    for key in ["Age", "Sex", "SES", "CSI", "SPS", "SAT", "Risk Level", "Probability"]:
        if key == "Risk Level":
            risk = data.get("result") or data.get("risk_level") or data.get(key.lower().replace(' ', '_')) or data.get(key) or ''
            value = risk["label"] if isinstance(risk, dict) and "label" in risk else risk
        else:
            value = data.get(key.lower().replace(' ', '_')) or data.get(key) or ''
        if key == "Sex":
            value = "Male" if str(value) == "1" else "Female"
        p.drawString(72, y, f"{key}: {value}")
        y -= 24
    p.setFont("Helvetica-Oblique", 11)
    p.drawString(72, y-10, "This report is for educational purposes only and does not replace professional medical advice.")
    p.showPage()
    p.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=Fibromyalgia_Report.pdf"})
from fastapi.responses import JSONResponse
@app.post("/chatbot")
async def chatbot(request: Request):
    data = await request.json()
    user_message = data.get('message', '')
    prediction_result = data.get('prediction_result', None)
    prediction_probability = data.get('prediction_probability', None)

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY
    )
    headers = {"Content-Type": "application/json"}

    context = ""
    if prediction_result is not None and prediction_probability is not None:
        context = (
            f"The user's prediction result is: {prediction_result}. "
            f"Probability: {prediction_probability}%. "
            "Explain or answer any questions about this result.\n\n"
        )
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{
                    "text": (
                        "You are a helpful assistant. "
                        "If the user asks about their prediction result, use the provided context.\n\n"
                        + context + user_message
                    )
                }]
            }
        ]
    }

    debug_info = {
        'prediction_result': prediction_result,
        'prediction_probability': prediction_probability,
        'context_sent': context,
        'user_message': user_message
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=15)
        r.raise_for_status()
        data = r.json()
        response = data.get('candidates', [{}])[0] \
                       .get('content', {}) \
                       .get('parts', [{}])[0] \
                       .get('text', '')
        if not response:
            response = "Sorry, I couldn't generate a response at this time."
    except Exception as e:
        import traceback
        traceback.print_exc()
        response = "Sorry, there was a problem contacting the assistant."
    return JSONResponse({'response': response, 'debug': debug_info})

@app.post("/register")
def register(user: User):
    logging.info(f"Register attempt: {user.email}")
    db: Session = SessionLocal()
    try:
        existing = db.query(DBUser).filter(DBUser.email == user.email).first()
        if existing:
            logging.warning(f"Email already registered: {user.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        if len(user.password) > 72:
            logging.error(f"Password too long for {user.email}: {len(user.password)} characters")
            raise HTTPException(status_code=400, detail="Password cannot be longer than 72 characters.")
        # Require phone number for all patients
        if user.role == 'patient' and not user.phone_number:
            raise HTTPException(status_code=400, detail='Phone number is required for patients.')
        hashed_password = get_password_hash(user.password)
        db_user = DBUser(email=user.email, full_name=user.full_name, hashed_password=hashed_password, role=user.role, phone_number=user.phone_number)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logging.info(f"Registration successful: {user.email}")
        return {"msg": "Registration successful"}
    except Exception as e:
        db.rollback()
        logging.error(f"Registration failed for {user.email}: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")
    finally:
        db.close()
# Utility endpoint to assign random phone numbers to existing patients without one
@app.post("/patients/assign-random-phone")
def assign_random_phone_numbers():
    db: Session = SessionLocal()
    try:
        patients = db.query(DBUser).filter(DBUser.role == 'patient').all()
        updated = 0
        for patient in patients:
            if not getattr(patient, 'phone_number', None):
                patient.phone_number = ''.join([str(random.randint(0,9)) for _ in range(10)])
                updated += 1
        db.commit()
        return {"updated": updated}
    finally:
        db.close()

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logging.info(f"Login attempt: {form_data.username}")
    db: Session = SessionLocal()
    try:
        user = db.query(DBUser).filter(DBUser.email == form_data.username).first()
        if not user or not verify_password(form_data.password, user.hashed_password):
            logging.warning(f"Login failed for: {form_data.username}")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        access_token = create_access_token(
            data={
                "sub": user.email,
                "role": user.role,
                "full_name": user.full_name
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        logging.info(f"Login successful: {form_data.username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role,
            "full_name": user.full_name,
            "email": user.email
        }
    except Exception as e:
        logging.error(f"Login error for {form_data.username}: {e}")
        raise HTTPException(status_code=500, detail="Login failed")
    finally:
        db.close()

@app.get("/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
@app.post("/login_doctor", response_model=Token)
def login_doctor(form_data: OAuth2PasswordRequestForm = Depends()):
    logging.info(f"Doctor login attempt: {form_data.username}")
    db: Session = SessionLocal()
    try:
        doctor = db.query(DBDoctor).filter(DBDoctor.email == form_data.username).first()
        if not doctor or not verify_password(form_data.password, doctor.hashed_password):
            logging.warning(f"Doctor login failed for: {form_data.username}")
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        access_token = create_access_token(
            data={
                "sub": doctor.email,
                "role": "doctor",
                "full_name": doctor.full_name
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        logging.info(f"Doctor login successful: {form_data.username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "doctor",
            "full_name": doctor.full_name,
            "email": doctor.email
        }
    except Exception as e:
        logging.error(f"Doctor login error for {form_data.username}: {e}")
        raise HTTPException(status_code=500, detail="Doctor login failed")
    finally:
        db.close()

class AppointmentRequest(BaseModel):
    doctor_id: int
    date: str  # 'YYYY-MM-DD'
    start_time: str  # 'HH:MM'
    end_time: str    # 'HH:MM'
    appointment_type: str = 'in-person'  # 'in-person' or 'online'

# List available slots for a doctor for the next 7 days
@app.get("/doctor/{doctor_id}/available-slots")
def get_doctor_available_slots(doctor_id: int):
    db: Session = SessionLocal()
    try:
        print(f"[DEBUG] Fetching available slots for doctor_id={doctor_id}")
        from datetime import date, datetime, timedelta, time as dtime
        today = date.today()
        slots = db.query(DBWeeklyAvailability).filter(DBWeeklyAvailability.doctor_id == doctor_id).all()
        print(f"[DEBUG] Weekly slots found: {slots}")
        result = []
        slot_duration = timedelta(minutes=30)
        for i in range(7):
            day = today + timedelta(days=i)
            dow = day.weekday()
            for slot in slots:
                if slot.day_of_week == dow:
                    slot_start = datetime.combine(day, dtime.fromisoformat(slot.start_time))
                    slot_end = datetime.combine(day, dtime.fromisoformat(slot.end_time))
                    current = slot_start
                    while current + slot_duration <= slot_end:
                        # Check for overlap with existing appointments
                        overlap = db.query(Appointment).filter(
                            Appointment.doctor_id == doctor_id,
                            Appointment.scheduled_time >= current,
                            Appointment.scheduled_time < current + slot_duration,
                            Appointment.status != 'cancelled'
                        ).first()
                        if not overlap:
                            result.append({
                                "date": str(day),
                                "start_time": current.time().strftime("%H:%M"),
                                "end_time": (current + slot_duration).time().strftime("%H:%M")
                            })
                        current += slot_duration
        return result
    finally:
        db.close()

# Book an appointment in a slot
@app.post("/appointments/book")
def book_appointment(req: AppointmentRequest, token: str = Depends(oauth2_scheme)):
    from datetime import datetime, timedelta, time as dtime
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "patient":
            raise HTTPException(status_code=403, detail="Only patients can book appointments.")
        db: Session = SessionLocal()
        patient = db.query(DBUser).filter(DBUser.email == email).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")
        # Check if slot is within doctor's available window
        slot_date = datetime.fromisoformat(req.date)
        start_dt = datetime.fromisoformat(f"{req.date}T{req.start_time}")
        end_dt = datetime.fromisoformat(f"{req.date}T{req.end_time}")
        # Find matching weekly availability
        dow = slot_date.weekday()
        weekly_slot = db.query(DBWeeklyAvailability).filter(
            DBWeeklyAvailability.doctor_id == req.doctor_id,
            DBWeeklyAvailability.day_of_week == dow
        ).first()
        if not weekly_slot:
            raise HTTPException(status_code=400, detail="Doctor not available on this day.")
        avail_start = datetime.combine(slot_date, dtime.fromisoformat(weekly_slot.start_time))
        avail_end = datetime.combine(slot_date, dtime.fromisoformat(weekly_slot.end_time))
        if start_dt < avail_start or end_dt > avail_end or start_dt >= end_dt:
            raise HTTPException(status_code=400, detail="Requested slot is outside doctor's available hours.")
        # Check for overlap with existing appointments
        overlap = db.query(Appointment).filter(
            Appointment.doctor_id == req.doctor_id,
            Appointment.scheduled_time < end_dt,
            (Appointment.scheduled_time + timedelta(minutes=30)) > start_dt,
            Appointment.status != 'cancelled'
        ).first()
        if overlap:
            raise HTTPException(status_code=400, detail="Slot already booked.")
        # Book the slot in Appointment table
        video_call_link = None
        if req.appointment_type == 'online':
            import uuid
            room_id = str(uuid.uuid4())
            video_call_link = f"https://meet.jit.si/{room_id}"
        new_appt = Appointment(
            doctor_id=req.doctor_id,
            patient_id=patient.id,
            scheduled_time=start_dt,
            status='confirmed',
            appointment_type=req.appointment_type,
            video_call_link=video_call_link
        )
        db.add(new_appt)
        db.commit()
        db.refresh(new_appt)
        return {"msg": "Appointment booked", "appointment_id": new_appt.id}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'db' in locals():
            db.close()

@app.get("/doctors")
def list_doctors():
    db: Session = SessionLocal()
    try:
        doctors = db.query(DBDoctor).all()
        return [
            {
                "id": doc.id,
                "full_name": doc.full_name,
                "email": doc.email,
                "specialization": doc.specialization
            }
            for doc in doctors
        ]
    finally:
        db.close()

@app.get("/doctor/appointments")
def doctor_appointments(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can view their appointments.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        appts = db.query(Appointment).filter(Appointment.doctor_id == doctor.id).all()
        result = []
        for a in appts:
            patient = db.query(DBUser).filter(DBUser.id == a.patient_id).first()
            phone_number = getattr(patient, 'phone_number', None)
            result.append({
                "id": a.id,
                "patient_name": patient.full_name if patient else None,
                "scheduled_time": a.scheduled_time,
                "status": a.status,
                "appointment_type": getattr(a, 'appointment_type', None),
                "video_call_link": getattr(a, 'video_call_link', None),
                "phone_number": phone_number
            })
        return result
    finally:
        if 'db' in locals():
            db.close()

# List all booked appointments for the logged-in patient
@app.get("/patient/appointments")
def patient_appointments(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "patient":
            raise HTTPException(status_code=403, detail="Only patients can view their appointments.")
        db: Session = SessionLocal()
        patient = db.query(DBUser).filter(DBUser.email == email).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")
        appts = db.query(Appointment).filter(Appointment.patient_id == patient.id).all()
        result = []
        for a in appts:
            doctor = db.query(DBDoctor).filter(DBDoctor.id == a.doctor_id).first()
            clinic_address = doctor.clinic_address if doctor else None
            phone_number = doctor.phone_number if doctor else None
            map_link = None
            if clinic_address:
                map_link = f"https://www.google.com/maps/search/?api=1&query={clinic_address.replace(' ', '+')}"
            result.append({
                "id": a.id,
                "doctor_name": doctor.full_name if doctor else None,
                "scheduled_time": a.scheduled_time,
                "status": a.status,
                "appointment_type": getattr(a, 'appointment_type', None),
                "video_call_link": getattr(a, 'video_call_link', None),
                "clinic_address": clinic_address,
                "phone_number": phone_number,
                "map_link": map_link
            })
        return result
    finally:
        if 'db' in locals():
            db.close()
@app.get("/doctor/me")
def get_doctor_profile(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can access this endpoint.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        # Return all relevant doctor fields
        return {
            "id": doctor.id,
            "full_name": doctor.full_name,
            "email": doctor.email,
            "specialization": doctor.specialization,
            "clinic_address": doctor.clinic_address,
            "phone_number": doctor.phone_number
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    finally:
        if 'db' in locals():
            db.close()

class DoctorUpdate(BaseModel):
    full_name: str
    specialization: str
    clinic_address: str
    phone_number: str

@app.put("/doctor/me")
def update_doctor_profile(update: DoctorUpdate, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "doctor":
            raise HTTPException(status_code=403, detail="Only doctors can update their profile.")
        db: Session = SessionLocal()
        doctor = db.query(DBDoctor).filter(DBDoctor.email == email).first()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found.")
        doctor.full_name = update.full_name
        doctor.specialization = update.specialization
        doctor.clinic_address = update.clinic_address
        doctor.phone_number = update.phone_number
        db.commit()
        db.refresh(doctor)
        return {
            "id": doctor.id,
            "full_name": doctor.full_name,
            "email": doctor.email,
            "specialization": doctor.specialization,
            "clinic_address": doctor.clinic_address,
            "phone_number": doctor.phone_number
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    finally:
        if 'db' in locals():
            db.close()

@app.get("/patient/me")
def get_patient_profile(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "patient":
            raise HTTPException(status_code=403, detail="Only patients can access this endpoint.")
        db: Session = SessionLocal()
        patient = db.query(DBUser).filter(DBUser.email == email).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")
        return {
            "id": patient.id,
            "full_name": patient.full_name,
            "email": patient.email,
            "phone_number": patient.phone_number
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    finally:
        if 'db' in locals():
            db.close()

class PatientUpdate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: str

# Update the logged-in patient's profile
@app.put("/patient/me")
def update_patient_profile(update: PatientUpdate, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if role != "patient":
            raise HTTPException(status_code=403, detail="Only patients can update their profile.")
        db: Session = SessionLocal()
        patient = db.query(DBUser).filter(DBUser.email == email).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")
        # Update fields
        patient.full_name = update.full_name
        patient.email = update.email
        patient.phone_number = update.phone_number
        db.commit()
        db.refresh(patient)
        return {
            "id": patient.id,
            "full_name": patient.full_name,
            "email": patient.email,
            "phone_number": patient.phone_number
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    finally:
        if 'db' in locals():
            db.close()