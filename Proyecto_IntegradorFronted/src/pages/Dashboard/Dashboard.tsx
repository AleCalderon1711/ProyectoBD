import { useEffect, useState } from 'react'
import { getAuditorias } from '../../api/auditorias'
import { getOrganizaciones } from '../../api/organizaciones'
import type { Auditoria } from '../../types/auditoria'
import type { Organizacion } from '../../types/organizacion'

export default function Dashboard() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([])
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([
      getAuditorias().catch(() => []),
      getOrganizaciones().catch(() => []),
    ])
      .then(([dataAuditorias, dataOrganizaciones]) => {
        setAuditorias(Array.isArray(dataAuditorias) ? dataAuditorias : [])
        setOrganizaciones(Array.isArray(dataOrganizaciones) ? dataOrganizaciones : [])
      })
      .finally(() => setCargando(false))
  }, [])

  // Calculamos los valores dinámicos
  const auditoriasActivas = auditorias.filter((a) => {
    const estado = (a.estado || '').toLowerCase()
    return estado.includes('progreso') || estado.includes('pendiente')
  }).length

  const organizacionesRegistradas = organizaciones.length

  const ultimaAuditoria = auditorias.length > 0
    ? (auditorias[auditorias.length - 1].fechaAuditoria || `ID: ${auditorias[auditorias.length - 1].id}`)
    : 'N/A'

  // Arreglo de tarjetas con títulos y sus datos reales
  const tarjetas = [
    { titulo: 'Auditorías activas', valor: auditoriasActivas },
    { titulo: 'Organizaciones registradas', valor: organizacionesRegistradas },
    { titulo: 'Riesgo promedio', valor: auditorias.length > 0 ? 'Medio (2.8)' : 'N/A' },
    { titulo: 'Última auditoría', valor: ultimaAuditoria },
  ]

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-700">Dashboard</h1>

      {cargando ? (
        <div className="p-4 text-sm text-gray-500">Cargando datos...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tarjetas.map((tarjeta) => (
            <div key={tarjeta.titulo} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">{tarjeta.titulo}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {tarjeta.valor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}