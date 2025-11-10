import axios from 'axios'
axios.defaults.withCredentials = true
import { handleApiError } from './handleApiError'
const BASE_URL = import.meta.env.VITE_API_BASE_URL

// 🧩 Interceptor global: agrega el JWT automáticamente en cada request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const UsersApi = {
  getUsers: async (page = 0, size = 5, sort = 'name,asc') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/users?page=${page}&size=${size}&sort=${sort}`
      )
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  deleteUser: async (idUser) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${idUser}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  getUserById: async (idUser) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${idUser}`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  getOwnProfile: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        withCredentials: true
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  registerUser: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  userAuthVerify: async (email, code) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/verify`,
        { email, code }
      )
      const token= response.data.result?.token
      if(token){
        localStorage.setItem('authToken', token)
      }
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

   // ✅ Login clásico (guardar token)
  loginUser: async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, user)
      const token = response.data.result?.token
      if (token) {
        localStorage.setItem('authToken', token)
      }
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

  updateUser: async (formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  updateOwnProfile: async (formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },
  // ✅ Obtener usuario autenticado (ya usa el header con JWT)
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`)
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  },

   // ✅ Logout: limpiar el token del almacenamiento
  logOut: async () => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`)
      localStorage.removeItem('authToken')
      sessionStorage.clear()
      return { message: 'Sesión cerrada correctamente.' }
    } catch (error) {
      handleApiError(error)
    }
  } 
}

export const searchUserName = async (
  name = '',
  page = 0,
  size = 5,
  sort = 'name,asc'
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users/search?name=${name}&page=${page}&size=${size}&sort=${sort}`
    )
    return response.data
  } catch (error) {
    handleApiError(error)
  }
}
