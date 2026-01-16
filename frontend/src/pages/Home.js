import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FloatingSVGBackground = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      opacity: 0.6,
    }}
  >
    <svg width="100vw" height="100vh" viewBox="0 0 1920 1080" style={{ position: 'absolute', width: '100vw', height: '100vh' }}>
      <defs>
        <radialGradient id="bg-gradient" cx="60%" cy="40%" r="1">
          <stop offset="0%" stopColor="#e3f0ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f9f9f9" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="heartbeat-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#81c784" />
        </linearGradient>
        <linearGradient id="dna-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7e57c2" />
          <stop offset="100%" stopColor="#26c6da" />
        </linearGradient>
        <linearGradient id="bandage-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="100%" stopColor="#ffb300" />
        </linearGradient>
        <linearGradient id="thermo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b3e5fc" />
          <stop offset="100%" stopColor="#0288d1" />
        </linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#bg-gradient)" />
      {/* Floating virus icons */}
      <g>
        <circle cx="300" cy="200" r="30" fill="#e57373">
          <animate attributeName="cy" values="200;900;200" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="1600" cy="300" r="22" fill="#f06292">
          <animate attributeName="cy" values="300;800;300" dur="10s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* Floating medicine capsules */}
      <g>
        <rect x="700" y="100" rx="20" ry="20" width="80" height="32" fill="#81c784">
          <animate attributeName="y" values="100;900;100" dur="14s" repeatCount="indefinite" />
        </rect>
        <rect x="1200" y="800" rx="20" ry="20" width="100" height="36" fill="#4fc3f7">
          <animate attributeName="y" values="800;200;800" dur="16s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Floating stethoscope icon */}
      <g>
        <path d="M400,900 Q420,950 440,900 Q460,850 480,900" stroke="#1976d2" strokeWidth="6" fill="none">
          <animate attributeName="d" values="M400,900 Q420,950 440,900 Q460,850 480,900;M400,920 Q420,970 440,920 Q460,870 480,920;M400,900 Q420,950 440,900 Q460,850 480,900" dur="10s" repeatCount="indefinite" />
        </path>
        <circle cx="440" cy="900" r="12" fill="#fff" stroke="#1976d2" strokeWidth="4" />
      </g>
      {/* Heartbeat line */}
      <polyline points="100,500 200,500 220,470 240,530 260,500 400,500" fill="none" stroke="url(#heartbeat-gradient)" strokeWidth="6">
        <animate attributeName="points" values="100,500 200,500 220,470 240,530 260,500 400,500;100,500 200,500 220,530 240,470 260,500 400,500;100,500 200,500 220,470 240,530 260,500 400,500" dur="6s" repeatCount="indefinite" />
      </polyline>
      {/* DNA helix animation */}
      <g>
        <path id="dna1" d="M1700,200 Q1720,250 1700,300 Q1680,350 1700,400" stroke="url(#dna-gradient)" strokeWidth="6" fill="none">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-200 400" dur="18s" repeatCount="indefinite" />
        </path>
        <ellipse cx="1700" cy="200" rx="8" ry="16" fill="#26c6da">
          <animate attributeName="cy" values="200;400;200" dur="18s" repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* Animated syringe */}
      <g>
        <rect x="300" y="900" width="12" height="60" fill="#bdbdbd">
          <animate attributeName="y" values="900;700;900" dur="13s" repeatCount="indefinite" />
        </rect>
        <rect x="295" y="890" width="22" height="20" fill="#90caf9">
          <animate attributeName="y" values="890;690;890" dur="13s" repeatCount="indefinite" />
        </rect>
        <rect x="304" y="960" width="4" height="16" fill="#1976d2">
          <animate attributeName="y" values="960;760;960" dur="13s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Floating shield icon */}
      <g>
        <path d="M900,900 Q920,940 940,900 Q940,870 920,860 Q900,870 900,900" fill="#fffde7" stroke="#ffd600" strokeWidth="4">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="0 -200" dur="15s" repeatCount="indefinite" />
        </path>
        <text x="915" y="900" fontSize="22" fill="#ffd600" fontWeight="bold">+</text>
      </g>
      {/* Floating bandages (left and right) */}
      <g>
        <rect x="80" y="300" rx="10" ry="10" width="90" height="24" fill="url(#bandage-gradient)" opacity="0.85">
          <animate attributeName="y" values="300;700;300" dur="17s" repeatCount="indefinite" />
        </rect>
        <rect x="1750" y="600" rx="10" ry="10" width="90" height="24" fill="url(#bandage-gradient)" opacity="0.85">
          <animate attributeName="y" values="600;200;600" dur="19s" repeatCount="indefinite" />
        </rect>
        <rect x="120" y="800" rx="10" ry="10" width="60" height="18" fill="url(#bandage-gradient)" opacity="0.7">
          <animate attributeName="y" values="800;400;800" dur="15s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Floating thermometers (left and right) */}
      <g>
        <rect x="60" y="100" width="16" height="70" rx="8" fill="url(#thermo-gradient)" opacity="0.8">
          <animate attributeName="y" values="100;600;100" dur="18s" repeatCount="indefinite" />
        </rect>
        <rect x="1840" y="200" width="16" height="70" rx="8" fill="url(#thermo-gradient)" opacity="0.8">
          <animate attributeName="y" values="200;800;200" dur="16s" repeatCount="indefinite" />
        </rect>
      </g>
      {/* Sparkles */}
      <g>
        <circle cx="900" cy="200" r="3" fill="#fff">
          <animate attributeName="r" values="3;7;3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="1500" cy="600" r="2" fill="#fff">
          <animate attributeName="r" values="2;6;2" dur="3.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="800" r="2.5" fill="#fff">
          <animate attributeName="r" values="2.5;5;2.5" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="1200" cy="400" r="2.5" fill="#fff">
          <animate attributeName="r" values="2.5;6;2.5" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="600" r="2.5" fill="#fff">
          <animate attributeName="r" values="2.5;5;2.5" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="2.5" fill="#fff">
          <animate attributeName="r" values="2.5;5;2.5" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="1720" cy="900" r="2.5" fill="#fff">
          <animate attributeName="r" values="2.5;5;2.5" dur="2.3s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  </Box>
);

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', py: 6, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)' }}>
      <FloatingSVGBackground />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={4} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4, background: 'rgba(255,255,255,0.85)' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" gutterBottom color="primary.main" sx={{ fontWeight: 700 }}>
                Your Health, Our Priority
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Book appointments, connect with doctors online or in-person, and manage your health easily.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button variant="contained" color="primary" size="large" onClick={() => navigate('/choose-login')} sx={{ px: 5, py: 1.5, fontSize: 18, borderRadius: 3 }}>
                  Login
                </Button>
                <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/choose-register')} sx={{ px: 5, py: 1.5, fontSize: 18, borderRadius: 3 }}>
                  Register
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Optionally add a hero SVG or Lottie here for more visual impact */}
            </Grid>
          </Grid>
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Book Online</Typography>
              <Typography variant="body2" color="text.secondary">Find doctors and book appointments instantly.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>Telemedicine</Typography>
              <Typography variant="body2" color="text.secondary">Join secure video calls for remote consultations.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>In-Person Visits</Typography>
              <Typography variant="body2" color="text.secondary">Visit clinics with real-time directions and info.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
