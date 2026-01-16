import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState('');
  const [bookedSlot, setBookedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const token = localStorage.getItem('token'); // patient token

  // Redirect or prompt if not logged in
  useEffect(() => {
    if (!token) {
      setMessage('Please log in as a patient to book an appointment.');
    }
  }, [token]);

  // Fetch doctors
  useEffect(() => {
    async function fetchDoctors() {
      setLoadingDoctors(true);
      try {
        const res = await axios.get(`${API_URL}/doctors`);
        setDoctors(res.data);
      } catch (err) {
        setDoctors([]);
        setMessage('Failed to load doctors.');
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, []);

  // Fetch slots when doctor changes
  useEffect(() => {
    async function fetchSlots() {
      setSlots([]);
      setMessage('');
      if (!selectedDoctor) return;
      setLoadingSlots(true);
      try {
        const res = await axios.get(`${API_URL}/doctor/${selectedDoctor}/available-slots`);
        setSlots(res.data);
        if (res.data.length === 0) setMessage('No available slots for this doctor in the next 7 days.');
      } catch (err) {
        setSlots([]);
        setMessage('Failed to load slots.');
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDoctor]);

  const handleBook = async (slot) => {
    setMessage('');
    setBooking(true);
    try {
      await axios.post(
        `${API_URL}/appointments/book`,
        {
          doctor_id: selectedDoctor,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          appointment_type: appointmentType
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage('Appointment booked!');
      setBookedSlot(slot);
      setSlots(slots.filter(s => !(s.date === slot.date && s.start_time === slot.start_time)));
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Appointment</h2>
      {!token && <div className="alert alert-warning mt-3">Please log in as a patient to book an appointment.</div>}
      <div className="mb-3">
        <label>Select Doctor:</label>
        {loadingDoctors ? (
          <div>Loading doctors...</div>
        ) : (
          <select
            className="form-select"
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            disabled={!token || loadingDoctors}
          >
            <option value="">-- Select --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.full_name} ({doc.specialization})</option>
            ))}
          </select>
        )}
      </div>
      <div className="mb-3">
        <label>Appointment Type:</label>
        <select
          className="form-select"
          value={appointmentType}
          onChange={e => setAppointmentType(e.target.value)}
          disabled={booking}
        >
          <option value="in-person">In-Person</option>
          <option value="online">Online (Telemedicine)</option>
        </select>
      </div>
      {loadingSlots && <div>Loading available slots...</div>}
      {selectedDoctor && !loadingSlots && slots.length === 0 && (
        <div className="alert alert-info mt-3">No available slots for this doctor in the next 7 days.</div>
      )}
      {slots.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, idx) => (
              <tr key={idx}>
                <td>{slot.date}</td>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleBook(slot)}
                    disabled={booking || (bookedSlot && bookedSlot.date === slot.date && bookedSlot.start_time === slot.start_time)}
                  >
                    {booking && (!bookedSlot || (bookedSlot.date === slot.date && bookedSlot.start_time === slot.start_time)) ? 'Booking...' : 'Book'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Only show general messages that are not the empty slots message */}
      {message && !(selectedDoctor && !loadingSlots && slots.length === 0 && message === 'No available slots for this doctor in the next 7 days.') && (
        <div className="alert alert-info mt-3">{message}</div>
      )}
    </div>
  );
}

export default BookAppointment;
