import type { LoginRequest, LoginResponse } from '../types/auth'

// TODO: cuando el backend esté listo, reemplazar por:
// const { data } = await axiosClient.post<LoginResponse>('/auth/login', payload)
// return data
export async function login(_payload: LoginRequest): Promise<LoginResponse> {
  return Promise.resolve({
    token: 'mock-token',
    usuario: {
      id: 1,
      nombre: 'Usuario Demo',
      correo: 'demo@empresa.com',
      rol: 'AUDITOR',
    },
  })
}
