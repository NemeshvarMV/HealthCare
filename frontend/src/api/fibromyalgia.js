import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const predictFibromyalgia = async (inputData, token) => {
  return axios.post(
    `${API_URL}/predict_fibromyalgia`,
    inputData,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
};
