import axios from 'axios'
import { handleApiError } from './handleApiError'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getOpenMeteo = async (latitude = 52.52, longitude = 13.41) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        latitude,
        longitude
      }
    })

    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
