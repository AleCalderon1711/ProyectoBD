import { usuariosMock } from '../mock/usuarios'
import type { Rol, Usuario } from '../types/auth'

export async function getUsuarios(): Promise<Usuario[]> {
  return Promise.resolve(usuariosMock)
}

export async function getUsuariosPorRol(rol: Rol): Promise<Usuario[]> {
  return Promise.resolve(usuariosMock.filter((usuario) => usuario.rol === rol))
}
