import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <BackButton />
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">Book Appointment</h2>
        {!token && <div className="bg-yellow-100 text-yellow-800 rounded px-4 py-3 mb-4 text-center font-medium">Please log in as a patient to book an appointment.</div>}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Select Doctor:</label>
          {loadingDoctors ? (
            <div className="text-blue-500 font-medium">Loading doctors...</div>
          ) : (
            <select
              className="form-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              disabled={!token || loadingDoctors}
            >
              <option value="">-- Select --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.full_name} (ID: {doc.id}, {doc.specialization})</option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">Appointment Type:</label>
          <select
            className="form-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={appointmentType}
            onChange={e => setAppointmentType(e.target.value)}
            disabled={booking}
          >
            <option value="in-person">In-Person</option>
            <option value="online">Online (Telemedicine)</option>
          </select>
        </div>
        {loadingSlots && <div className="text-blue-500 font-medium mb-4">Loading available slots...</div>}
        {selectedDoctor && !loadingSlots && slots.length === 0 && (
          <div className="bg-blue-100 text-blue-800 rounded px-4 py-3 mb-4 text-center font-medium">No available slots for this doctor in the next 7 days.</div>
        )}
        {slots.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm mt-3">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Start Time</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">End Time</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, idx) => (
                  <tr key={idx} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
                    <td className="px-4 py-2">{slot.date}</td>
                    <td className="px-4 py-2">{slot.start_time}</td>
                    <td className="px-4 py-2">{slot.end_time}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
          </div>
        )}
        {/* Only show general messages that are not the empty slots message */}
        {message && !(selectedDoctor && !loadingSlots && slots.length === 0 && message === 'No available slots for this doctor in the next 7 days.') && (
          <div className="bg-blue-100 text-blue-800 rounded px-4 py-3 mt-4 text-center font-medium">{message}</div>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;
