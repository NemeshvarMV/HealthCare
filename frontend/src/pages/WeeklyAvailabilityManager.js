import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/doctor/weekly-availability';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WeeklyAvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ day_of_week: 0, start_time: '', end_time: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('doctor_token');

  const fetchSlots = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data);
    } catch (err) {
      setMessage('Failed to fetch weekly slots');
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Slot updated');
      } else {
        await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Slot added');
      }
      setForm({ day_of_week: 0, start_time: '', end_time: '' });
      setEditId(null);
      fetchSlots();
    } catch (err) {
      setMessage('Failed to save slot');
    }
  };

  const handleEdit = (slot) => {
    setForm({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time
    });
    setEditId(slot.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Slot deleted');
      fetchSlots();
    } catch (err) {
      setMessage('Failed to delete slot');
    }
  };

  return (
    <div className="mt-4">
      <h4>Manage Weekly Availability</h4>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-3">
            <label>Day</label>
            <select name="day_of_week" className="form-select" value={form.day_of_week} onChange={handleChange} required>
              {days.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label>Start Time</label>
            <input type="time" name="start_time" className="form-control" value={form.start_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label>End Time</label>
            <input type="time" name="end_time" className="form-control" value={form.end_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100">{editId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot.id}>
              <td>{days[slot.day_of_week]}</td>
              <td>{slot.start_time}</td>
              <td>{slot.end_time}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(slot)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(slot.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WeeklyAvailabilityManager;
