export type Rol = 'AUDITOR' | 'DBA'

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: Rol
}

export interface LoginRequest {
  correo: string
  contrasena: string
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}
