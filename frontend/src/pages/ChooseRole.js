import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

const ChooseRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Determine if this is for register or login
  const isRegister = location.pathname.includes('register');

  const handleChoice = (role) => {
    if (isRegister) {
      if (role === 'patient') navigate('/register');
      else navigate('/doctor/register');
    } else {
      if (role === 'patient') navigate('/login');
      else navigate('/doctor/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #42a5f5 0%, #81c784 100%)', position: 'relative', overflow: 'hidden' }}>
      <FloatingSVGBackground />
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4, minWidth: 350, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
          <BackButton />
          <Typography variant="h4" align="center" gutterBottom>
            {isRegister ? 'Register' : 'Login'} as
          </Typography>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Button variant="outlined" color="primary" size="large" onClick={() => handleChoice('patient')}>
              Patient
            </Button>
            <Button variant="outlined" color="success" size="large" onClick={() => handleChoice('doctor')}>
              Doctor
            </Button>
          </Stack>
        </Paper>
      </Box>
    </div>
  );
};

export default ChooseRole;
