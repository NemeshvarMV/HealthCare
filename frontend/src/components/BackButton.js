import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="back-btn-responsive"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0.5em 1.2em',
        fontSize: '1rem',
        borderRadius: 8,
        border: 'none',
        background: 'linear-gradient(90deg, #42a5f5 0%, #81c784 100%)',
        color: '#fff',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
        cursor: 'pointer',
        marginBottom: '1.2em',
        transition: 'background 0.2s',
      }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      Back
    </button>
  );
};

export default BackButton;

// Responsive styles (add to index.css or a global CSS file):
/*
.back-btn-responsive {
  width: auto;
  min-width: 80px;
  max-width: 100%;
}
@media (max-width: 600px) {
  .back-btn-responsive {
    font-size: 0.95rem;
    padding: 0.45em 0.9em;
    border-radius: 6px;
  }
}
*/
