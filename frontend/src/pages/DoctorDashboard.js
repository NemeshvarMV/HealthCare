import React from 'react';
import { useNavigate } from 'react-router-dom';
import WeeklyAvailabilityManager from './WeeklyAvailabilityManager';
import FloatingSVGBackground from '../components/FloatingSVGBackground';


function DoctorDashboard() {
  const navigate = useNavigate();
  return (
    <>
      <FloatingSVGBackground />
      <div className="container mt-4" style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '2rem' }}>
        <h2>Doctor Dashboard</h2>
        <button
          style={{ marginBottom: '1.5em', padding: '0.7em 1.2em', fontSize: '1.05rem', borderRadius: '7px', background: '#38b6ff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}
          onClick={() => navigate('/doctor/appointments')}
        >
          View My Appointments
        </button>
        <WeeklyAvailabilityManager />
      </div>
    </>
  );
}

export default DoctorDashboard;
