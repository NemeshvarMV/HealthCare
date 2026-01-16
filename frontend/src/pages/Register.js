import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

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
      // Only send address/phone if doctor
      const submitForm = { ...form };
      if (form.role !== 'doctor') {
        delete submitForm.clinic_address;
        delete submitForm.phone_number;
      }
      await registerUser(submitForm);
      setMessage('Registration successful! Please login.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <>
      <FloatingSVGBackground />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, minWidth: 350, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
          <Typography variant="h4" align="center" gutterBottom>Register</Typography>
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
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
              name="password"
              label="Password"
              type="password"
              value={form.password}
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
}

export default Register;
