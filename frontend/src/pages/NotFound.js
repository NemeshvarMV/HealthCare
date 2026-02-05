import React from 'react';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';

function NotFound() {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #42a5f5 0%, #81c784 100%)', position: 'relative', overflow: 'hidden' }}>
      <FloatingSVGBackground />
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '2rem', margin: '3rem auto', maxWidth: 600, textAlign: 'center' }}>
        <BackButton />
        <h2>404 - Page Not Found</h2>
      </div>
    </div>
  );
}

export default NotFound;
