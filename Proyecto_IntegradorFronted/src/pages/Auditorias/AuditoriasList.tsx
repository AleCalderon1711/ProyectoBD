import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuditorias } from '../../api/auditorias'
import { getOrganizaciones } from '../../api/organizaciones'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import Table, { type TableColumn } from '../../components/common/Table'
import type { Auditoria, EstadoAuditoria } from '../../types/auditoria'
import type { Organizacion } from '../../types/organizacion'

interface AuditoriaRow extends Auditoria {
  organizacionNombre: string
}

const estadoBadgeClasses: Record<EstadoAuditoria, string> = {
  Pendiente: 'bg-gray-100 text-gray-700',
  'En progreso': 'bg-amber-100 text-amber-700',
  Completada: 'bg-emerald-100 text-emerald-700',
}

export default function AuditoriasList() {
  const navigate = useNavigate()
  const [auditorias, setAuditorias] = useState<Auditoria[]>([])
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [search, setSearch] = useState('')
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

  const handleNuevaAuditoria = () => {
    navigate('/auditorias/nueva')
  }

  const filas: AuditoriaRow[] = useMemo(() => {
    return auditorias.map((auditoria) => {
      const orgEncontrada = organizaciones.find(
        (org) => String(org.id) === String(auditoria.organizacionId)
      )
      return {
        ...auditoria,
        organizacionNombre: orgEncontrada?.nombre ?? String(auditoria.organizacionId || 'N/A'),
      }
    })
  }, [auditorias, organizaciones])

  const filasFiltradas = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return filas

    return filas.filter((fila) =>
      [
        fila.id,
        fila.organizacionNombre,
        fila.auditorResponsable,
        fila.dbaResponsable ?? '',
        fila.estado,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    )
  }, [filas, search])

  const columns: TableColumn<AuditoriaRow>[] = [
    { key: 'id', header: 'ID' },
    { key: 'organizacionNombre', header: 'Organización' },
    { key: 'auditorResponsable', header: 'Auditor' },
    {
      key: 'dbaResponsable',
      header: 'DBA',
      render: (row) => row.dbaResponsable || '—',
    },
    { key: 'fechaAuditoria', header: 'Fecha' },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => {
        const badgeClass = estadoBadgeClasses[row.estado] || 'bg-gray-100 text-gray-700'
        return (
          <span className={`rounded px-2 py-1 text-xs font-medium ${badgeClass}`}>
            {row.estado || 'Pendiente'}
          </span>
        )
      },
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) =>
        row.estado === 'Completada' ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-blue-600 hover:underline"
              onClick={() => navigate(`/auditorias/${row.id}/resultados`)}
            >
              Ver resultados
            </button>
            <button
              type="button"
              className="text-xs text-gray-500 hover:underline"
              onClick={() => navigate(`/auditorias/${row.id}/cuestionario`)}
            >
              Ver cuestionario
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={() => navigate(`/auditorias/${row.id}/cuestionario`)}
          >
            Continuar cuestionario
          </button>
        ),
    },
  ]

  return (
    <div>
      <PageHeader title="Auditorías" actionLabel="Iniciar auditoría" onActionClick={handleNuevaAuditoria} />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por ID, organización, auditor, DBA o estado"
      />

      {cargando ? (
        <div className="p-8 text-center text-sm text-gray-500">Cargando auditorías...</div>
      ) : filasFiltradas.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Todavía no hay auditorías registradas. Iniciá la primera con el botón de arriba.
        </div>
      ) : (
        <Table columns={columns} data={filasFiltradas} getRowKey={(row) => String(row.id)} />
      )}
    </div>
  )
}