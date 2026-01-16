import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export const sendChatbotMessage = async (message, predictionResult, predictionProbability) => {
  return axios.post(
    `${API_URL}/chatbot`,
    {
      message,
      prediction_result: predictionResult,
      prediction_probability: predictionProbability
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
