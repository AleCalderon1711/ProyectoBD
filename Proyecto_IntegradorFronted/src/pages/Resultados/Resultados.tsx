import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import Semaforo from '../../components/common/Semaforo'
import { getAuditoriaById } from '../../api/auditorias'
import { getOrganizacionById } from '../../api/organizaciones'
import type { Auditoria, ResultadoControl } from '../../types/auditoria'
import type { Organizacion } from '../../types/organizacion'

// Color de celda del mapa de calor según el % de cumplimiento del control.
// Se arma a mano con divs, como sugiere la sección 5 del documento
// ("no hace falta librería especial").
function colorMapaCalor(cumplimiento: number): string {
  if (cumplimiento >= 80) return 'bg-emerald-500'
  if (cumplimiento >= 60) return 'bg-amber-400'
  if (cumplimiento >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

export default function Resultados() {
  const { id } = useParams<{ id: string }>()
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null)
  const [organizacion, setOrganizacion] = useState<Organizacion | null>(null)
  const [cargando, setCargando] = useState(true)
  const [exportando, setExportando] = useState(false)

  useEffect(() => {
    if (!id) return
    getAuditoriaById(id).then((encontrada) => {
      setAuditoria(encontrada ?? null)
      if (encontrada) {
        getOrganizacionById(encontrada.organizacionId).then((org) => setOrganizacion(org ?? null))
      }
      setCargando(false)
    })
  }, [id])

  const rankingControlesDebiles = useMemo<ResultadoControl[]>(() => {
    if (!auditoria?.resultados) return []
    return [...auditoria.resultados.resultadosPorControl].sort((a, b) => a.cumplimiento - b.cumplimiento).slice(0, 5)
  }, [auditoria])

  // El PDF ejecutivo lo genera el backend (sección 3, punto 8 del
  // documento); acá el frontend solo dispara la descarga cuando exista
  // el endpoint real.
  const handleExportar = async () => {
    setExportando(true)
    try {
      window.alert(
        'La exportación a PDF la genera el backend. Cuando el endpoint esté listo, este botón disparará la descarga automáticamente.',
      )
    } finally {
      setExportando(false)
    }
  }

  if (cargando) {
    return <p className="text-sm text-gray-500">Cargando resultados…</p>
  }

  if (!auditoria) {
    return (
      <div>
        <PageHeader title="Resultados" />
        <p className="text-sm text-gray-600">No se encontró la auditoría solicitada.</p>
      </div>
    )
  }

  if (!auditoria.resultados) {
    return (
      <div>
        <PageHeader title="Resultados" />
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Esta auditoría todavía no fue finalizada. Completá el cuestionario y finalizá la auditoría para ver sus
          resultados.
        </div>
      </div>
    )
  }

  const { resultados } = auditoria

  return (
    <div>
      <PageHeader
        title="Panel de resultados"
        actionLabel={exportando ? 'Exportando…' : 'Exportar reporte ejecutivo'}
        onActionClick={handleExportar}
      />

      <div className="mb-4 rounded border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">
          Organización: <span className="font-medium text-gray-700">{organizacion?.nombre ?? auditoria.organizacionId}</span>
          {' · '}Auditor: <span className="font-medium text-gray-700">{auditoria.auditorResponsable}</span>
          {' · '}Fecha: <span className="font-medium text-gray-700">{auditoria.fechaAuditoria}</span>
        </p>
      </div>

      {/* Índice general con semáforo */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Cumplimiento general</p>
          <p className="mt-2 text-2xl font-semibold text-gray-700">{resultados.cumplimientoGeneral}%</p>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Índice general de riesgo</p>
          <p className="mt-2 text-2xl font-semibold text-gray-700">{resultados.indiceGeneralRiesgo}%</p>
        </div>
        <div className="flex flex-col justify-between rounded border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Nivel de riesgo</p>
          <div className="mt-2">
            <Semaforo nivel={resultados.nivelRiesgo} />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Gráfico de barras por dominio */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Cumplimiento por dominio</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resultados.resultadosPorDominio}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="dominio" tick={{ fontSize: 11, fill: '#4b5563' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#4b5563' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Cumplimiento']} />
                <Bar dataKey="cumplimiento" fill="#374151" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar C/I/D */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Exposición al riesgo (C / I / D)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  { dimension: 'Confidencialidad', valor: resultados.exposicion.confidencialidad },
                  { dimension: 'Integridad', valor: resultados.exposicion.integridad },
                  { dimension: 'Disponibilidad', valor: resultados.exposicion.disponibilidad },
                ]}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#4b5563' }} />
                <Radar dataKey="valor" stroke="#b91c1c" fill="#ef4444" fillOpacity={0.4} />
                <Tooltip formatter={(value) => [`${value}%`, 'Exposición']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Ranking de controles más débiles */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Controles más débiles</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {rankingControlesDebiles.map((control) => (
              <div key={control.idControl} className="flex items-center justify-between gap-3 py-2">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600">
                      {control.codigo}
                    </span>
                    {control.nombre}
                  </p>
                  <p className="text-xs text-gray-400">{control.dominio}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{control.cumplimiento}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de calor: dominio x control, coloreado por cumplimiento */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Mapa de calor por control</h2>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
            {resultados.resultadosPorControl.map((control) => (
              <div
                key={control.idControl}
                title={`${control.codigo} · ${control.nombre} — ${control.cumplimiento}%`}
                className={`flex aspect-square items-center justify-center rounded text-[10px] font-semibold text-white ${colorMapaCalor(control.cumplimiento)}`}
              >
                {control.codigo}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-emerald-500" /> ≥80%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-amber-400" /> 60-79%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-orange-500" /> 40-59%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-red-500" /> &lt;40%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
