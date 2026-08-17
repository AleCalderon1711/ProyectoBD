import type { Organizacion } from './organizacion'

export type EstadoAuditoria = 'Pendiente' | 'En progreso' | 'Completada'

export type NivelRiesgo = 'Bajo' | 'Medio' | 'Alto' | 'Crítico'

export type Dominio = 'Organizacional' | 'Personas' | 'Físico' | 'Tecnológico'

export interface ResultadoDominio {
  dominio: Dominio
  cumplimiento: number
}

export interface ResultadoControl {
  idControl: string
  codigo: string
  nombre: string
  dominio: Dominio
  nivelMadurez: number
  cumplimiento: number
}

export interface Exposicion {
  confidencialidad: number
  integridad: number
  disponibilidad: number
}

// Refleja la respuesta de GET /api/auditorias/{id}/resultados descrita en
// la sección 4 del documento de contexto. `cumplimientoPorcentaje` y
// `riesgo` se mantienen por compatibilidad con el cálculo simple que ya
// usaba el mock; los campos nuevos son los que pide el contrato completo.
export interface AuditoriaResultado {
  cumplimientoPorcentaje: number
  riesgo: string
  cumplimientoGeneral: number
  indiceGeneralRiesgo: number
  nivelRiesgo: NivelRiesgo
  resultadosPorDominio: ResultadoDominio[]
  resultadosPorControl: ResultadoControl[]
  exposicion: Exposicion
}

export type ValorRespuesta = 'SI' | 'NO' | 'NA'

export interface RespuestaPregunta {
  idPregunta: string
  respuesta: ValorRespuesta
  evidencia: string
}

export interface Auditoria {
  id: string
  organizacionId: Organizacion['id']
  auditorResponsable: string
  dbaResponsable?: string
  fechaAuditoria: string
  observacionesGenerales: string
  estado: EstadoAuditoria
  respuestas: RespuestaPregunta[]
  resultados: AuditoriaResultado | null
}

export interface NuevaAuditoriaInput {
  organizacionId: Organizacion['id']
  auditorResponsable: string
  dbaResponsable?: string
  fechaAuditoria: string
  observacionesGenerales: string
}
