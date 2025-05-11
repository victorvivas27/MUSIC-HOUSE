import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const submitFaq = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/faq`, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
 
  
};



  