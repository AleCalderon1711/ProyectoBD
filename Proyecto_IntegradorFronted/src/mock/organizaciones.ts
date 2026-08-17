import type { Organizacion } from '../types/organizacion'

export const organizacionesMock: Organizacion[] = [
  {
    id: 'ORG-001',
    nombre: 'TechSecure S.A.',
    rubro: 'Tecnología',
    pais: 'Chile',
    estado: 'Activa',
    fechaCreacion: '2025-01-10',
  },
  {
    id: 'ORG-002',
    nombre: 'FinData Group',
    rubro: 'Finanzas',
    pais: 'México',
    estado: 'Activa',
    fechaCreacion: '2024-11-02',
  },
  {
    id: 'ORG-003',
    nombre: 'Salud Integral SPA',
    rubro: 'Salud',
    pais: 'Perú',
    estado: 'Inactiva',
    fechaCreacion: '2023-08-19',
  },
  {
    id: 'ORG-004',
    nombre: 'Retail Norte Ltda.',
    rubro: 'Retail',
    pais: 'Colombia',
    estado: 'Activa',
    fechaCreacion: '2026-02-14',
  },
]
