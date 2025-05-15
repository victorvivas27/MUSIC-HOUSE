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

 export const getAllFaq = async (page = 0, size = 5, sort = 'registDate,desc') => {
     try {
         const response = await axios.get(`${BASE_URL}/faq`, {
             params: { page, size, sort }
         })
         return response.data
     } catch (error) {
         handleApiError(error)
     }
 }
  export const getAllFaqA = async (page = 0, size = 5, sort = 'registDate,desc') => {
     try {
         const response = await axios.get(`${BASE_URL}/faq/admin`, {
             params: { page, size, sort }
         })
         return response.data
     } catch (error) {
         handleApiError(error)
     }
 }

 export const deleteFaq = async (idFaq) => {
  try {
    const response = await axios
    .delete(`${BASE_URL}/faq/${idFaq}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
export const updateFaq = async ({ idFaq,answer,active}) => {
  try {
    const response = await axios
    .patch(`${BASE_URL}/faq`, {
      idFaq,
      answer,
      active
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getFaqById = async (idFaq) => {
  try {
    const response = await axios
    .get(`${BASE_URL}/faq/${idFaq}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



  