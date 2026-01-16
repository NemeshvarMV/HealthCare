import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/doctor/availability';

function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState({ start_time: '', end_time: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Get token from localStorage or another secure place
  const token = localStorage.getItem('doctor_token');

  const fetchSlots = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data);
    } catch (err) {
      setMessage('Failed to fetch slots');
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
      setForm({ start_time: '', end_time: '' });
      setEditId(null);
      fetchSlots();
    } catch (err) {
      setMessage('Failed to save slot');
    }
  };

  const handleEdit = (slot) => {
    setForm({
      start_time: slot.start_time.slice(0, 16),
      end_time: slot.end_time.slice(0, 16)
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
      <h4>Manage Availability</h4>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label>Start Time</label>
            <input type="datetime-local" name="start_time" className="form-control" value={form.start_time} onChange={handleChange} required />
          </div>
          <div className="col-md-5">
            <label>End Time</label>
            <input type="datetime-local" name="end_time" className="form-control" value={form.end_time} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">{editId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.map(slot => (
            <tr key={slot.id}>
              <td>{new Date(slot.start_time).toLocaleString()}</td>
              <td>{new Date(slot.end_time).toLocaleString()}</td>
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

export default AvailabilityManager;
