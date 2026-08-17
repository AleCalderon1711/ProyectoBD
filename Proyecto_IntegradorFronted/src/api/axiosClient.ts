import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/', // 👈 URL directa al puerto de Spring Boot
})

// Adjunta el token JWT en cada petición si el usuario inició sesión
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient