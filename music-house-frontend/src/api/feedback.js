import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getAllFeedback = async (page = 0, size = 5, sort = 'registDate,desc') => {
    try {
        const response = await axios.get(`${BASE_URL}/feedback`, {
            params: { page, size, sort }
        })
        return response.data
    } catch (error) {
        handleApiError(error)
    }
}


export const submitFeedback = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/feedback`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  };


  export const deleteFeedback = async (idFeedback) => {
  try {
    const response = await axios
    .delete(`${BASE_URL}/feedback/${idFeedback}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};