
import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getReservations = async (page=0,size=10,sort="startDate,asc") => {
  try {
    const response = await axios
    .get(`${BASE_URL}/reservations?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getReservationByInstrumentId = async (idInstrument) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/reservations/instrument/${idInstrument}/reserved-dates`,
      {
        withCredentials: true // Asegura que se envíe la cookie (para rol ADMIN)
      }
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
export const getReservationById = async (id, page = 0, size = 5) => {
  try {
    const response = await axios
    .get( `${BASE_URL}/reservations/user/${id}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const deleteReservation = async (idInstrument, idUser, idReservation) => {
  try {
    const response = await axios
    .delete(`${BASE_URL}/reservations/${idInstrument}/${idUser}/${idReservation}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const cancelReservation = async (idInstrument, idUser, idReservation) => {
  try {
    const response = await axios
    .patch(`${BASE_URL}/reservations/cancel/${idInstrument}/${idUser}/${idReservation}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createReservation = async (idUser, idInstrument, startDate, endDate) => {
  try {
    const response = await axios.post(`${BASE_URL}/reservations`, {
      idUser,
      idInstrument,
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
