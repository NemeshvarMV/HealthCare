import React from 'react';
import { useNavigate } from 'react-router-dom';
import WeeklyAvailabilityManager from './WeeklyAvailabilityManager';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';
import LogoutButton from '../components/LogoutButton';


function DoctorDashboard() {
    // Appointments state for upcoming appointments
    const [appointments, setAppointments] = React.useState([]);
  const navigate = useNavigate();
  // Fetch real doctor data after login
  const [doctor, setDoctor] = React.useState(null);

  // Fetch doctor info and appointments after login
  React.useEffect(() => {
    const token = localStorage.getItem('doctor_token');
    if (!token) return;
    // Fetch doctor info
    fetch('http://localhost:8000/doctor/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDoctor(data))
      .catch(() => setDoctor(null));
    // Fetch appointments for this doctor
    fetch('http://localhost:8000/doctor/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(() => setAppointments([]));
  }, []);


  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editForm, setEditForm] = React.useState({});
  const handleEditProfile = () => {
    setEditForm({ ...doctor });
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('doctor_token');
    try {
      const res = await fetch('http://localhost:8000/doctor/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setDoctor(updated);
        setShowEditModal(false);
      }
    } catch {}
  };
  const handleEditCancel = () => {
    setEditForm({ ...doctor });
    setShowEditModal(false);
  };
  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-200 to-green-300">
        <div className="text-xl text-blue-700 font-semibold">Loading doctor info...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-700 tracking-tight mb-4 md:mb-0">Doctor Dashboard</h2>
          <LogoutButton />
        </div>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-8">
          <div className="flex-1 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-6 shadow-md mb-4 md:mb-0">
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">Welcome, Dr. {doctor.full_name}</h3>
            <div className="text-gray-700 space-y-1">
              <div><span className="font-medium">Doctor ID:</span> {doctor.id || <span className='italic text-gray-400'>Not available</span>}</div>
              <div><span className="font-medium">Specialization:</span> {doctor.specialization}</div>
              <div><span className="font-medium">Clinic Address:</span> {doctor.clinic_address}</div>
              <div><span className="font-medium">Phone:</span> {doctor.phone_number}</div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        </div>
        {/* Doctor Availability Section */}
        <div className="mb-10">
          <h4 className="text-xl font-semibold text-blue-700 mb-4">Set Your Weekly Availability</h4>
          <WeeklyAvailabilityManager />
        </div>
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-blue-700 mb-4">Upcoming Appointments</h4>
          {appointments && appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-blue-700">Patient Name</th>
                    <th className="px-4 py-2 text-left text-blue-700">Scheduled Time</th>
                    <th className="px-4 py-2 text-left text-blue-700">Status</th>
                    <th className="px-4 py-2 text-left text-blue-700">Type</th>
                    <th className="px-4 py-2 text-left text-blue-700">Video Call Link</th>
                    <th className="px-4 py-2 text-left text-blue-700">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {[...appointments].reverse().map((appt) => (
                    <tr key={appt.id} className="border-b last:border-none">
                      <td className="px-4 py-2">{appt.patient_name || <span className="italic text-gray-400">Unknown</span>}</td>
                      <td className="px-4 py-2">{appt.scheduled_time ? new Date(appt.scheduled_time).toLocaleString() : '-'}</td>
                      <td className="px-4 py-2">{appt.status}</td>
                      <td className="px-4 py-2">{appt.appointment_type || '-'}</td>
                      <td className="px-4 py-2">
                        {appt.video_call_link ? (
                          <a href={appt.video_call_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Join</a>
                        ) : (
                          <span className="italic text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{appt.phone_number || <span className="italic text-gray-400">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 italic">No upcoming appointments.</div>
          )}
        </div>
        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">Edit Profile</h3>
              <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                  <input
                    name="full_name"
                    value={editForm.full_name || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Specialization</label>
                  <input
                    name="specialization"
                    value={editForm.specialization || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Clinic Address</label>
                  <input
                    name="clinic_address"
                    value={editForm.clinic_address || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                  <input
                    name="phone_number"
                    value={editForm.phone_number || ''}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="button" className="flex-1 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300" onClick={handleEditCancel}>Cancel</button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600">Save</button>
                </div>
              </form>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={handleEditCancel}>&times;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
