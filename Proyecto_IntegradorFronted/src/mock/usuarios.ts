import type { Usuario } from '../types/auth'

export const usuariosMock: Usuario[] = [
  { id: 1, nombre: 'Ana Rodríguez', correo: 'ana.rodriguez@consultora.com', rol: 'AUDITOR' },
  { id: 2, nombre: 'Carlos Vargas', correo: 'carlos.vargas@consultora.com', rol: 'AUDITOR' },
  { id: 3, nombre: 'Mariana Solís', correo: 'mariana.solis@consultora.com', rol: 'AUDITOR' },
  { id: 4, nombre: 'Diego Chaves', correo: 'diego.chaves@empresa.com', rol: 'DBA' },
  { id: 5, nombre: 'Laura Jiménez', correo: 'laura.jimenez@empresa.com', rol: 'DBA' },
]
