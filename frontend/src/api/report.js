import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const generateReport = async (inputData, result, probability, token) => {
  return axios.post(
    `${API_URL}/generate_report`,
    {
      ...inputData,
      result,
      probability
    },
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
};
