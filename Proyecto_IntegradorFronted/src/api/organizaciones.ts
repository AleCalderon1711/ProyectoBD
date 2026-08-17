import axiosClient from './axiosClient'
import type { Organizacion } from '../types/organizacion'

// Obtener todas las organizaciones de la base de datos
export async function getOrganizaciones(): Promise<Organizacion[]> {
  try {
    const { data } = await axiosClient.get<Organizacion[]>('/organizaciones')
    return data
  } catch (error) {
    console.error('Error al obtener organizaciones:', error)
    return []
  }
}

// Obtener una organización por su ID
export async function getOrganizacionById(id: string): Promise<Organizacion | undefined> {
  try {
    const { data } = await axiosClient.get<Organizacion>(`/organizaciones/${id}`)
    return data
  } catch (error) {
    console.error(`Error al obtener la organización con ID ${id}:`, error)
    return undefined
  }
}

// Crear una organización en la base de datos
export async function createOrganizacion(organizacion: Omit<Organizacion, 'id'>): Promise<Organizacion> {
  const { data } = await axiosClient.post<Organizacion>('/organizaciones', organizacion)
  return data
}