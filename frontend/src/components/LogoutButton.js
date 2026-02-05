import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  return (
    <button
      onClick={handleLogout}
      className="logout-btn-responsive"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0.5em 1.2em',
        fontSize: '1rem',
        borderRadius: 8,
        border: 'none',
        background: 'linear-gradient(90deg, #e57373 0%, #ffb300 100%)',
        color: '#fff',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
        cursor: 'pointer',
        marginBottom: '1.2em',
        marginLeft: '1em',
        transition: 'background 0.2s',
      }}
    >
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
      Logout
    </button>
  );
};

export default LogoutButton;

// Responsive styles (add to index.css or a global CSS file):
/*
.logout-btn-responsive {
  width: auto;
  min-width: 80px;
  max-width: 100%;
}
@media (max-width: 600px) {
  .logout-btn-responsive {
    font-size: 0.95rem;
    padding: 0.45em 0.9em;
    border-radius: 6px;
  }
}
*/
