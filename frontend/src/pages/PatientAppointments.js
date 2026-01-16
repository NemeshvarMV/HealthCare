import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

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
    <>
      <FloatingSVGBackground />
      <div className="container mt-4" style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '2rem' }}>
        <h2>My Appointments</h2>
        {loading && <div>Loading...</div>}
        {message && <div className="alert alert-info mt-3">{message}</div>}
        {appointments.length > 0 && (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Scheduled Time</th>
                <th>Status</th>
                <th>Type</th>
                <th>Video Call Link</th>
                <th>Clinic Address</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.doctor_name || appt.doctor_id || 'N/A'}</td>
                  <td>{appt.scheduled_time ? new Date(appt.scheduled_time).toLocaleString() : 'N/A'}</td>
                  <td>{appt.status}</td>
                  <td>{appt.appointment_type || 'N/A'}</td>
                  <td>
                    {appt.appointment_type === 'online' && appt.video_call_link ? (
                      <a href={appt.video_call_link} target="_blank" rel="noopener noreferrer">Join Call</a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{appt.appointment_type === 'in-person' && appt.clinic_address ? appt.clinic_address : '-'}</td>
                  <td>{appt.appointment_type === 'in-person' && appt.phone_number ? appt.phone_number : '-'}</td>
                  <td>
                    {appt.appointment_type === 'in-person' && appt.clinic_address ? (
                      <iframe
                        width="300"
                        height="200"
                        style={{ border: 0 }}
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
        )}
      </div>
    </>
  );
}

export default PatientAppointments;
