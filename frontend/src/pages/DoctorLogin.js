import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

const DoctorLogin = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const params = new URLSearchParams();
      params.append('username', form.username);
      params.append('password', form.password);
      const res = await axios.post('http://localhost:8000/login_doctor', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      // Store the JWT token for doctor endpoints
      localStorage.setItem('doctor_token', res.data.access_token);
      localStorage.setItem('doctor_email', res.data.email);
      setMessage('Login successful!');
      setTimeout(() => {
        navigate('/doctor');
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <BackButton />
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">Doctor Login</h2>
        {message && <div className={`rounded px-4 py-3 mb-4 text-center font-medium ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              name="username"
              type="email"
              value={form.username}
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
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
