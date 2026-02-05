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


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictFibromyalgia } from '../api/fibromyalgia';
import { generateReport } from '../api/report';
import axios from 'axios';
import './PatientDashboard.css';
import './PatientDashboardChatbot.css';
import { sendChatbotMessage } from '../api/chatbot';
import FloatingSVGBackground from '../components/FloatingSVGBackground';
import BackButton from '../components/BackButton';
import LogoutButton from '../components/LogoutButton';

function PatientDashboard() {
  const navigate = useNavigate();
  // Patient profile state
  const [patient, setPatient] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch patient info after login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8000/patient/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPatient(data))
      .catch(() => setPatient(null));
  }, []);

  const handleEditProfile = () => {
    setEditForm({ ...patient });
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8000/patient/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const updated = await res.json();
        setPatient(updated);
        setShowEditModal(false);
      }
    } catch {}
  };
  const handleEditCancel = () => {
    setEditForm({ ...patient });
    setShowEditModal(false);
  };
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
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-200 to-green-300 overflow-hidden">
      <FloatingSVGBackground />
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 mt-8 mb-8">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <BackButton />
          <LogoutButton />
        </div>
        <div className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">Patient Dashboard</div>
        {patient && (
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="flex-1 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-6 shadow-md mb-4 md:mb-0">
              <h3 className="text-2xl font-semibold text-blue-800 mb-2">Welcome, {patient.full_name}</h3>
              <div className="text-gray-700 space-y-1">
                <div><span className="font-medium">Patient ID:</span> {patient.id || <span className='italic text-gray-400'>Not available</span>}</div>
                <div><span className="font-medium">Email:</span> {patient.email || <span className='italic text-gray-400'>Not available</span>}</div>
                <div><span className="font-medium">Phone Number:</span> {patient.phone_number || <span className='italic text-gray-400'>Not available</span>}</div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>
        )}
                {/* Edit Profile Modal */}
                {showEditModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
                      <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">Edit Profile</h3>
                      <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                          <input
                            name="full_name"
                            value={editForm.full_name || ''}
                            onChange={handleEditChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">Email</label>
                          <input
                            name="email"
                            type="email"
                            value={editForm.email || ''}
                            onChange={handleEditChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                          <input
                            name="phone_number"
                            type="text"
                            value={editForm.phone_number || ''}
                            onChange={handleEditChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                          />
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button type="button" className="flex-1 bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-300" onClick={handleEditCancel}>Cancel</button>
                          <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-green-600">Save</button>
                        </div>
                      </form>
                      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={handleEditCancel}>&times;</button>
                    </div>
                  </div>
                )}
        <div className="flex gap-4 mb-6">
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            onClick={() => navigate('/patient/appointments')}
          >
            My Appointments
          </button>
          <button
            className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            onClick={() => navigate('/book-appointment')}
          >
            Fix Appointment
          </button>
        </div>
        <form className="w-full flex flex-col md:flex-row md:gap-8 mb-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-gray-700 font-semibold">Age</span>
              <input type="number" name="age" value={form.age} onChange={handleChange} required min="0" max="120" placeholder="Enter your age" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Sex (0=Female, 1=Male)</span>
              <input type="number" name="sex" value={form.sex} onChange={handleChange} required min="0" max="1" placeholder="0 for Female, 1 for Male" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Socioeconomic Status (SES)</span>
              <input type="number" name="ses" value={form.ses} onChange={handleChange} required step="any" placeholder="SES score" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">CSI Total Score</span>
              <input type="number" name="csi" value={form.csi} onChange={handleChange} required step="any" placeholder="Central Sensitization Inventory" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">SPS Total Score</span>
              <input type="number" name="sps" value={form.sps} onChange={handleChange} required step="any" placeholder="Sensory Perception Scale" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">SAT Total Score</span>
              <input type="number" name="sat" value={form.sat} onChange={handleChange} required step="any" placeholder="Sleep Assessment Tool" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
            </label>
          </div>
          <div className="flex flex-col justify-center items-center mt-6 md:mt-0 md:ml-6">
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
              {loading ? 'Predicting...' : 'Predict Fibromyalgia Risk'}
            </button>
          </div>
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
          
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
