export interface Organizacion {
  id: string
  nombre: string
  rubro: string
  pais: string
  estado: 'Activa' | 'Inactiva'
  fechaCreacion: string
}
