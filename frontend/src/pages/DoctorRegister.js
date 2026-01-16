import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

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
    <>
      <FloatingSVGBackground />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, minWidth: 400, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
          <Typography variant="h4" align="center" gutterBottom>Doctor Registration</Typography>
          {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="full_name"
              label="Full Name"
              value={form.full_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="specialization"
              label="Specialization"
              value={form.specialization}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="clinic_address"
              label="Clinic Address"
              value={form.clinic_address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="phone_number"
              label="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default DoctorRegister;
