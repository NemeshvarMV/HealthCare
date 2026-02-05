import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'patient', clinic_address: '', phone_number: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const submitForm = { ...form };
      // Always require phone number for patients
      if (form.role === 'patient' && !form.phone_number) {
        setError('Phone number is required for patients.');
        return;
      }
      if (form.role !== 'doctor') {
        delete submitForm.clinic_address;
      }
      await registerUser(submitForm);
      setMessage('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <BackButton />
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">Register</h2>
        {message && <div className="bg-green-100 text-green-800 rounded px-4 py-3 mb-4 text-center font-medium">{message}</div>}
        {error && <div className="bg-red-100 text-red-800 rounded px-4 py-3 mb-4 text-center font-medium">{error}</div>}
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
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
          {form.role === 'patient' && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
              <input
                name="phone_number"
                type="tel"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          )}
          {/* Additional fields for doctor registration can be added here if needed */}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
