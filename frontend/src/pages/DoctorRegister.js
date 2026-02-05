import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

const DoctorRegister = () => {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    specialization: '',
    clinic_address: '',
    phone_number: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8000/register_doctor', form);
      setMessage(res.data.msg || 'Registration successful!');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <BackButton />
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">Doctor Registration</h2>
        {message && <div className={`rounded px-4 py-3 mb-4 text-center font-medium ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Specialization</label>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your specialization"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Clinic Address</label>
            <input
              name="clinic_address"
              value={form.clinic_address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your clinic address"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              placeholder="Enter your phone number"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
