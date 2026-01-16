// Utility to decode JWT token
function parseJwt (token) {
  if (!token) return {};
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictFibromyalgia } from '../api/fibromyalgia';
import { generateReport } from '../api/report';
import axios from 'axios';
import './PatientDashboard.css';
import './PatientDashboardChatbot.css';
import { sendChatbotMessage } from '../api/chatbot';
import FloatingSVGBackground from '../components/FloatingSVGBackground';

function PatientDashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '',
    sex: '',
    ses: '',
    csi: '',
    sps: '',
    sat: ''
  });
  const [result, setResult] = useState(null);
  const [probability, setProbability] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'assistant', text: 'Hi! I am your Fibromyalgia Assistant. Ask me about your prediction or anything related.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setProbability(null);
    setLoading(true);
    setReport(null);
    try {
      // Convert fields to numbers
      const inputData = {
        age: parseFloat(form.age),
        sex: parseInt(form.sex),
        ses: parseFloat(form.ses),
        csi: parseFloat(form.csi),
        sps: parseFloat(form.sps),
        sat: parseFloat(form.sat)
      };
      const token = localStorage.getItem('token');
      const res = await predictFibromyalgia(inputData, token);
      setResult(res.data.result);
      setProbability(res.data.probability);
      // Save inputData for report
      setForm((prev) => ({ ...prev, ...inputData }));
                // Debug: log inputData before report generation
                console.log('Report inputData:', inputData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  // Chatbot handlers
  const handleChatOpen = () => setChatOpen(true);
  const handleChatClose = () => setChatOpen(false);
  const handleChatInput = (e) => setChatInput(e.target.value);
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { sender: 'user', text: chatInput }]);
    setChatLoading(true);
    try {
      const res = await sendChatbotMessage(
        chatInput,
        result,
        probability
      );
      setChatMessages((msgs) => [
        ...msgs,
        { sender: 'assistant', text: res.data.response }
      ]);
    } catch {
      setChatMessages((msgs) => [
        ...msgs,
        { sender: 'assistant', text: 'Sorry, there was a problem contacting the assistant.' }
      ]);
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  return (
    <>
      <FloatingSVGBackground />
      <div className="patient-dashboard-container" style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.85)', borderRadius: '16px', padding: '2rem' }}>
        <div className="patient-dashboard-title">Patient Dashboard</div>
        <div style={{ display: 'flex', gap: '1em', marginBottom: '1.5em' }}>
          <button
            style={{ padding: '0.7em 1.2em', fontSize: '1.05rem', borderRadius: '7px', background: '#38b6ff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}
            onClick={() => navigate('/patient/appointments')}
          >
            View My Appointments
          </button>
          <button
            style={{ padding: '0.7em 1.2em', fontSize: '1.05rem', borderRadius: '7px', background: '#4f8cff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}
            onClick={() => navigate('/book-appointment')}
          >
            Fix Appointment
          </button>
        </div>
        <form className="patient-dashboard-form" onSubmit={handleSubmit} autoComplete="off">
          <label>Age
            <input type="number" name="age" value={form.age} onChange={handleChange} required min="0" max="120" placeholder="Enter your age" />
          </label>
          <label>Sex (0=Female, 1=Male)
            <input type="number" name="sex" value={form.sex} onChange={handleChange} required min="0" max="1" placeholder="0 for Female, 1 for Male" />
          </label>
          <label>Socioeconomic Status (SES)
            <input type="number" name="ses" value={form.ses} onChange={handleChange} required step="any" placeholder="SES score" />
          </label>
          <label>CSI Total Score
            <input type="number" name="csi" value={form.csi} onChange={handleChange} required step="any" placeholder="Central Sensitization Inventory" />
          </label>
          <label>SPS Total Score
            <input type="number" name="sps" value={form.sps} onChange={handleChange} required step="any" placeholder="Sensory Perception Scale" />
          </label>
          <label>SAT Total Score
            <input type="number" name="sat" value={form.sat} onChange={handleChange} required step="any" placeholder="Sleep Assessment Tool" />
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Predict Fibromyalgia Risk'}</button>
        </form>
        {error && <div className="patient-dashboard-error">{error}</div>}
        {result && (
          <div className="patient-dashboard-result">
            <span className="risk">
              <i className={result.icon} style={{ fontSize: '1.5em', verticalAlign: 'middle', marginRight: '0.5em' }}></i>
              {result.label}
            </span>
            <span className="probability">Probability: {probability}%</span>
            <button
              className="patient-dashboard-report-btn"
              style={{ marginTop: '1.2em', padding: '0.7em 1.2em', fontSize: '1.05rem', borderRadius: '7px', background: '#4f8cff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}
              disabled={reportLoading}
              onClick={async () => {
                setReportLoading(true);
                setReport(null);
                try {
                  const token = localStorage.getItem('token');
                  let full_name = window.localStorage.getItem('full_name') || '';
                  let email = window.localStorage.getItem('email') || '';
                  if (!full_name || !email) {
                    const payload = parseJwt(token);
                    if (!full_name && payload.full_name) full_name = payload.full_name;
                    if (!email && payload.sub) email = payload.sub;
                  }
                  // Debug: log extracted values
                  console.log('Extracted full_name:', full_name, 'Extracted email:', email);
                  if (!full_name) full_name = '-';
                  const inputData = {
                    age: parseFloat(form.age),
                    sex: parseInt(form.sex),
                    ses: parseFloat(form.ses),
                    csi: parseFloat(form.csi),
                    sps: parseFloat(form.sps),
                    sat: parseFloat(form.sat),
                    full_name,
                    email
                  };
                  const res = await generateReport(inputData, result, probability, token);
                  setReport(res.data);
                } catch {
                  setReport({ error: 'Failed to generate report.' });
                } finally {
                  setReportLoading(false);
                }
              }}
            >{reportLoading ? 'Generating Report...' : 'Generate Report'}</button>
          </div>
        )}
        {report && !report.error && (
          <div className="patient-dashboard-report" style={{ marginTop: '2em', background: '#f8fafc', borderRadius: '12px', boxShadow: '0 2px 8px rgba(44,62,80,0.06)', padding: '1.5em 1.2em' }}>
            <h3 style={{ color: '#2d3a4b', fontWeight: 700, marginBottom: '1em' }}>{report.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.entries(report.fields).map(([key, value]) => (
                <li key={key} style={{ marginBottom: '0.7em', fontSize: '1.08rem' }}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
            <div style={{ marginTop: '1.2em', color: '#3a4a5d', fontSize: '1.05rem' }}>{report.summary}</div>
            <button
              className="patient-dashboard-report-btn"
              style={{ marginTop: '1.5em', padding: '0.7em 1.2em', fontSize: '1.05rem', borderRadius: '7px', background: '#38b6ff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  let full_name = window.localStorage.getItem('full_name') || '';
                  let email = window.localStorage.getItem('email') || '';
                  if (!full_name || !email) {
                    const payload = parseJwt(token);
                    if (!full_name && payload.full_name) full_name = payload.full_name;
                    if (!email && payload.sub) email = payload.sub;
                  }
                  const inputData = {
                    age: parseFloat(form.age),
                    sex: parseInt(form.sex),
                    ses: parseFloat(form.ses),
                    csi: parseFloat(form.csi),
                    sps: parseFloat(form.sps),
                    sat: parseFloat(form.sat),
                    result,
                    probability,
                    full_name,
                    email
                  };
                  // Debug: log inputData before PDF download
                  console.log('PDF inputData:', inputData);
                  const res = await axios.post(
                    (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000') + '/download_report',
                    inputData,
                    {
                      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
                      responseType: 'blob'
                    }
                  );
                  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'Fibromyalgia_Report.pdf');
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                } catch {
                  alert('Failed to download PDF report.');
                }
              }}
            >Download PDF</button>
          </div>
        )}
        {report && report.error && (
          <div className="patient-dashboard-error">{report.error}</div>
        )}

        {/* Chatbot Floating Button */}
        <div
          className="chatbot-fab"
          title="Chat with Fibromyalgia Assistant"
          onClick={handleChatOpen}
          style={{ display: chatOpen ? 'none' : 'flex' }}
        >💬</div>

        {/* Chatbot Sidebar */}
        <div className={`chatbot-sidebar${chatOpen ? '' : ' chatbot-closed'}`}>
          <div className="chatbot-header">
            Fibromyalgia Assistant
            <span className="chatbot-close" title="Close" onClick={handleChatClose}>×</span>
          </div>
          <div className="chatbot-messages" id="chatbot-messages">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={msg.sender === 'user' ? 'chatbot-user' : 'chatbot-assistant'}>
                {msg.text}
              </div>
            ))}
            {chatLoading && <div className="chatbot-assistant">...</div>}
          </div>
          <form className="chatbot-form" onSubmit={handleChatSubmit} autoComplete="off">
            <input
              type="text"
              value={chatInput}
              onChange={handleChatInput}
              placeholder="Ask about your result..."
              maxLength={200}
              disabled={chatLoading}
              className="chatbot-input"
            />
            <button type="submit" disabled={chatLoading || !chatInput.trim()}>Send</button>
          </form>
          <div className="chatbot-disclaimer">
            This information is for educational purposes only and does not replace professional medical advice.
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;
