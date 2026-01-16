import React from 'react';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

function NotFound() {
  return (
    <>
      <FloatingSVGBackground />
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '2rem', margin: '3rem auto', maxWidth: 600, textAlign: 'center' }}>
        <h2>404 - Page Not Found</h2>
      </div>
    </>
  );
}

export default NotFound;
