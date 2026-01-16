import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

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
    <>
      <FloatingSVGBackground />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, minWidth: 350, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
          <Typography variant="h4" align="center" gutterBottom>Doctor Login</Typography>
          {message && <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Email"
              type="email"
              value={form.username}
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
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default DoctorLogin;
