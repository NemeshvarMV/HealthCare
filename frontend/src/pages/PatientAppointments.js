import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

const API_URL = 'http://localhost:8000';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setMessage('');
      try {
        const res = await axios.get(`${API_URL}/patient/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
        if (res.data.length === 0) setMessage('No appointments found.');
      } catch (err) {
        setMessage('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchAppointments();
    else setMessage('Please log in as a patient to view appointments.');
  }, [token]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-6xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <BackButton />
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">My Appointments</h2>
        {loading && <div className="text-blue-500 font-medium mb-4">Loading...</div>}
        {message && <div className="bg-blue-100 text-blue-800 rounded px-4 py-3 mb-4 text-center font-medium">{message}</div>}
        {appointments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm mt-3">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Doctor Name</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Scheduled Time</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Video Call Link</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Clinic Address</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Phone Number</th>
                  <th className="px-4 py-2 text-left text-blue-700 font-semibold">Map</th>
                </tr>
              </thead>
              <tbody>
                {[...appointments].reverse().map((appt) => (
                  <tr key={appt.id} className="even:bg-blue-50 hover:bg-blue-100 transition-colors">
                    <td className="px-4 py-2">{appt.doctor_name || appt.doctor_id || 'N/A'}</td>
                    <td className="px-4 py-2">{appt.scheduled_time ? new Date(appt.scheduled_time).toLocaleString() : 'N/A'}</td>
                    <td className="px-4 py-2">{appt.status}</td>
                    <td className="px-4 py-2">{appt.appointment_type || 'N/A'}</td>
                    <td className="px-4 py-2">
                      {appt.appointment_type === 'online' && appt.video_call_link ? (
                        <a href={appt.video_call_link} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Join Call</a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-2">{appt.clinic_address || '-'}</td>
                    <td className="px-4 py-2">{appt.phone_number || '-'}</td>
                    <td className="px-4 py-2">
                      {appt.clinic_address ? (
                        <iframe
                          width="220"
                          height="120"
                          style={{ border: 0, borderRadius: '8px' }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps?q=${encodeURIComponent(appt.clinic_address)}&output=embed`}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientAppointments;
