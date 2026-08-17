import axiosClient from './axiosClient'
import { controlesCuestionarioMock } from '../mock/cuestionario'
import type { RelacionImpacto } from '../mock/cuestionario'
import type {
  AuditoriaResultado,
  Auditoria,
  Dominio,
  Exposicion,
  NivelRiesgo,
  NuevaAuditoriaInput,
  ResultadoControl,
  ResultadoDominio,
  RespuestaPregunta,
} from '../types/auditoria'

const pesoImpacto: Record<RelacionImpacto, number> = { Alta: 3, Media: 2, Baja: 1 }

function calcularNivelRiesgo(cumplimiento: number): NivelRiesgo {
  if (cumplimiento >= 80) return 'Bajo'
  if (cumplimiento >= 60) return 'Medio'
  if (cumplimiento >= 40) return 'Alto'
  return 'Crítico'
}

function calcularResultados(respuestas: RespuestaPregunta[]): AuditoriaResultado {
  const resultadosPorControl: ResultadoControl[] = controlesCuestionarioMock.map((control) => {
    const respuestasControl = control.preguntas
      .map((pregunta) => respuestas.find((r) => r.idPregunta === pregunta.id))
      .filter((r): r is RespuestaPregunta => r !== undefined)

    const aplicables = respuestasControl.filter((r) => r.respuesta !== 'NA')
    const afirmativas = respuestasControl.filter((r) => r.respuesta === 'SI')
    const cumplimiento = aplicables.length > 0 ? Math.round((afirmativas.length / aplicables.length) * 1000) / 10 : 0

    let nivelMadurez = 0
    for (const pregunta of [...control.preguntas].sort((a, b) => a.nivel - b.nivel)) {
      const respuesta = respuestas.find((r) => r.idPregunta === pregunta.id)
      if (respuesta?.respuesta === 'SI') {
        nivelMadurez = pregunta.nivel
      } else if (respuesta?.respuesta === 'NO') {
        break
      }
    }

    return {
      idControl: control.id,
      codigo: control.codigoIso,
      nombre: control.nombre,
      dominio: control.dominio,
      nivelMadurez,
      cumplimiento,
    }
  })

  const dominios = Array.from(new Set(controlesCuestionarioMock.map((c) => c.dominio))) as Dominio[]
  const resultadosPorDominio: ResultadoDominio[] = dominios.map((dominio) => {
    const controlesDominio = resultadosPorControl.filter((r) => r.dominio === dominio)
    const promedio =
      controlesDominio.length > 0
        ? Math.round((controlesDominio.reduce((sum, r) => sum + r.cumplimiento, 0) / controlesDominio.length) * 10) /
          10
        : 0
    return { dominio, cumplimiento: promedio }
  })

  const cumplimientoGeneral =
    resultadosPorControl.length > 0
      ? Math.round((resultadosPorControl.reduce((sum, r) => sum + r.cumplimiento, 0) / resultadosPorControl.length) * 10) /
        10
      : 0

  const calcularExposicionDimension = (dimension: 'relacionC' | 'relacionI' | 'relacionD'): number => {
    let sumaPonderada = 0
    let sumaPesos = 0
    for (const control of controlesCuestionarioMock) {
      const resultado = resultadosPorControl.find((r) => r.idControl === control.id)
      if (!resultado) continue
      const peso = pesoImpacto[control[dimension]]
      sumaPonderada += peso * (100 - resultado.cumplimiento)
      sumaPesos += peso
    }
    return sumaPesos > 0 ? Math.round((sumaPonderada / sumaPesos) * 10) / 10 : 0
  }

  const exposicion: Exposicion = {
    confidencialidad: calcularExposicionDimension('relacionC'),
    integridad: calcularExposicionDimension('relacionI'),
    disponibilidad: calcularExposicionDimension('relacionD'),
  }

  const indiceGeneralRiesgo =
    Math.round(((exposicion.confidencialidad + exposicion.integridad + exposicion.disponibilidad) / 3) * 10) / 10

  return {
    cumplimientoPorcentaje: cumplimientoGeneral,
    riesgo: calcularNivelRiesgo(cumplimientoGeneral),
    cumplimientoGeneral,
    indiceGeneralRiesgo,
    nivelRiesgo: calcularNivelRiesgo(cumplimientoGeneral),
    resultadosPorDominio,
    resultadosPorControl,
    exposicion,
  }
}

// 1. Crear auditoría en BD
export async function createAuditoria(input: NuevaAuditoriaInput): Promise<Auditoria> {
  const { data } = await axiosClient.post<Auditoria>('/auditorias', input)
  return data
}

// 2. Obtener todas las auditorías de la BD
export async function getAuditorias(): Promise<Auditoria[]> {
  try {
    const { data } = await axiosClient.get<Auditoria[]>('/auditorias')
    return data
  } catch (error) {
    console.error('Error al obtener auditorías:', error)
    return []
  }
}

// 3. Obtener auditoría por ID desde la BD
export async function getAuditoriaById(id: string): Promise<Auditoria | undefined> {
  try {
    const { data } = await axiosClient.get<Auditoria>(`/auditorias/${id}`)
    return data
  } catch (error) {
    console.error(`Error al obtener auditoría ${id}:`, error)
    return undefined
  }
}

// 4. Obtener auditorías por organización desde la BD
export async function getAuditoriasByOrganizacion(organizacionId: string): Promise<Auditoria[]> {
  try {
    const { data } = await axiosClient.get<Auditoria[]>(`/auditorias?organizacionId=${organizacionId}`)
    return data
  } catch (error) {
    console.error('Error al obtener auditorías por organización:', error)
    return []
  }
}

// 5. Guardar respuestas parciales (Modo En progreso) en la BD
export async function guardarRespuestas(
  idAuditoria: string,
  respuestas: RespuestaPregunta[],
): Promise<Auditoria | undefined> {
  const { data } = await axiosClient.put<Auditoria>(`/auditorias/${idAuditoria}/respuestas`, {
    respuestas,
    estado: 'En progreso',
  })
  return data
}

// 6. Finalizar auditoría y persistir los resultados calculados en la BD
export async function finalizarAuditoria(idAuditoria: string): Promise<Auditoria | undefined> {
  // Primero obtenemos las respuestas actuales para generar los resultados
  const auditoriaActual = await getAuditoriaById(idAuditoria)
  const respuestas = auditoriaActual?.respuestas ?? []
  const resultadosCalculados = calcularResultados(respuestas)

  const { data } = await axiosClient.post<Auditoria>(`/auditorias/${idAuditoria}/finalizar`, {
    estado: 'Completada',
    resultados: resultadosCalculados,
  })
  return data
}

// 7. Obtener resultados desde la BD
export async function getResultados(idAuditoria: string): Promise<AuditoriaResultado | undefined> {
  try {
    const { data } = await axiosClient.get<AuditoriaResultado>(`/auditorias/${idAuditoria}/resultados`)
    return data
  } catch (error) {
    console.error(`Error al obtener resultados de ${idAuditoria}:`, error)
    return undefined
  }
}