import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import Semaforo from '../../components/common/Semaforo'
import Table, { type TableColumn } from '../../components/common/Table'
import { getAuditoriasByOrganizacion } from '../../api/auditorias'
import { getOrganizaciones } from '../../api/organizaciones'
import type { Auditoria, NivelRiesgo } from '../../types/auditoria'
import type { Organizacion } from '../../types/organizacion'

export default function Historial() {
  const navigate = useNavigate()
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [organizacionId, setOrganizacionId] = useState<string>('')
  const [auditorias, setAuditorias] = useState<Auditoria[]>([])
  const [cargando, setCargando] = useState(true)

  // Carga inicial de organizaciones
  useEffect(() => {
    getOrganizaciones()
      .then((orgs) => {
        const listaOrgs = Array.isArray(orgs) ? orgs : []
        setOrganizaciones(listaOrgs)
        if (listaOrgs.length > 0) {
          setOrganizacionId(String(listaOrgs[0].id))
        } else {
          setCargando(false)
        }
      })
      .catch((err) => {
        console.error('Error al obtener organizaciones:', err)
        setCargando(false)
      })
  }, [])

  // Carga de auditorías al cambiar la organización seleccionada
  useEffect(() => {
    if (!organizacionId) return

    setCargando(true)
    getAuditoriasByOrganizacion(organizacionId)
      .then((data) => {
        const listaAuditorias = Array.isArray(data) ? data : []
        // Ordenado seguro protegiendo posibles valores undefined o nulos
        const ordenadas = [...listaAuditorias].sort((a, b) => {
          const fechaA = a.fechaAuditoria || ''
          const fechaB = b.fechaAuditoria || ''
          return fechaA.localeCompare(fechaB)
        })
        setAuditorias(ordenadas)
      })
      .catch((err) => {
        console.error('Error al obtener historial de auditorías:', err)
        setAuditorias([])
      })
      .finally(() => {
        setCargando(false)
      })
  }, [organizacionId])

  const auditoriasFinalizadas = useMemo(
    () =>
      auditorias.filter((auditoria) => {
        const estado = (auditoria.estado || '').toLowerCase()
        return estado === 'completada' && Boolean(auditoria.resultados)
      }),
    [auditorias],
  )

  const datosGrafico = useMemo(
    () =>
      auditoriasFinalizadas.map((auditoria) => ({
        fecha: auditoria.fechaAuditoria || 'S/F',
        cumplimiento: auditoria.resultados?.cumplimientoGeneral ?? 0,
        riesgo: auditoria.resultados?.indiceGeneralRiesgo ?? 0,
      })),
    [auditoriasFinalizadas],
  )

  const columns: TableColumn<Auditoria>[] = [
    { key: 'id', header: 'ID' },
    { key: 'fechaAuditoria', header: 'Fecha', render: (row) => row.fechaAuditoria || '—' },
    { key: 'auditorResponsable', header: 'Auditor' },
    {
      key: 'cumplimiento',
      header: 'Cumplimiento',
      render: (row) => (row.resultados ? `${row.resultados.cumplimientoGeneral}%` : '—'),
    },
    {
      key: 'nivelRiesgo',
      header: 'Riesgo',
      render: (row) =>
        row.resultados ? <Semaforo nivel={row.resultados.nivelRiesgo as NivelRiesgo} /> : '—',
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <button
          type="button"
          className="text-xs text-blue-600 hover:underline"
          onClick={() => navigate(`/auditorias/${row.id}/resultados`)}
        >
          Ver resultados
        </button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Historial de auditorías" />

      {organizaciones.length > 0 && (
        <div className="mb-4 max-w-sm">
          <label htmlFor="select-organizacion" className="mb-1 block text-sm text-gray-600">
            Organización
          </label>
          <select
            id="select-organizacion"
            value={organizacionId}
            onChange={(event) => setOrganizacionId(event.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            {organizaciones.map((organizacion) => (
              <option key={String(organizacion.id)} value={String(organizacion.id)}>
                {organizacion.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {cargando ? (
        <div className="p-8 text-center text-sm text-gray-500">Cargando historial…</div>
      ) : organizaciones.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Todavía no hay organizaciones registradas.
        </div>
      ) : auditorias.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Esta organización todavía no tiene auditorías registradas.
        </div>
      ) : (
        <>
          <div className="mb-4 rounded border border-gray-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              Evolución del cumplimiento en el tiempo
            </h2>
            {datosGrafico.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#4b5563' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#4b5563' }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cumplimiento"
                      name="Cumplimiento %"
                      stroke="#374151"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="riesgo"
                      name="Índice de riesgo %"
                      stroke="#b91c1c"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Todavía no hay auditorías finalizadas para esta organización — el gráfico aparece cuando exista al menos una.
              </p>
            )}
          </div>

          <Table columns={columns} data={auditorias} getRowKey={(row) => String(row.id)} />
        </>
      )}
    </div>
  )
}