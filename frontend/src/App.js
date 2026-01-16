
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import PatientAppointments from './pages/PatientAppointments';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorRegister from './pages/DoctorRegister';
import DoctorLogin from './pages/DoctorLogin';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import ChooseRole from './pages/ChooseRole';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/patient/*" element={<PatientDashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/doctor/*" element={<DoctorDashboard />} />
      <Route path="/patient/appointments" element={<PatientAppointments />} />
      <Route path="/doctor/appointments" element={<DoctorAppointments />} />
      <Route path="/doctor/register" element={<DoctorRegister />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/choose-register" element={<ChooseRole />} />
      <Route path="/choose-login" element={<ChooseRole />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
