import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrganizaciones } from '../../api/organizaciones'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import Table, { type TableColumn } from '../../components/common/Table'
import type { Organizacion } from '../../types/organizacion'

export default function OrganizacionesList() {
  const navigate = useNavigate()
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [search, setSearch] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getOrganizaciones()
      .then((data) => {
        setOrganizaciones(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error('Error al obtener organizaciones:', err)
      })
      .finally(() => setCargando(false))
  }, [])

  const handleNuevaOrganizacion = () => {
    navigate('/organizaciones/nueva')
  }

  const handleVer = (id: string) => {
    navigate(`/organizaciones/${id}/editar`)
  }

  const handleEditar = (id: string) => {
    navigate(`/organizaciones/${id}/editar`)
  }

  const handleIniciarAuditoria = (id: string) => {
    navigate(`/auditorias/nueva?organizacionId=${id}`)
  }

  const organizacionesFiltradas = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    if (!normalizedSearch) return organizaciones

    return organizaciones.filter((organizacion) =>
      [
        organizacion.id,
        organizacion.nombre,
        organizacion.rubro,
        organizacion.pais,
        organizacion.estado,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    )
  }, [organizaciones, search])

  const columns: TableColumn<Organizacion>[] = [
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'rubro', header: 'Rubro' },
    { key: 'pais', header: 'País' },
    { key: 'estado', header: 'Estado' },
    { key: 'fechaCreacion', header: 'Fecha de creación' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline"
            onClick={() => handleVer(String(row.id))}
          >
            Ver
          </button>
          <button
            type="button"
            className="text-xs text-amber-600 hover:underline"
            onClick={() => handleEditar(String(row.id))}
          >
            Editar
          </button>
          <button
            type="button"
            className="text-xs text-emerald-600 hover:underline"
            onClick={() => handleIniciarAuditoria(String(row.id))}
          >
            Iniciar auditoría
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Organizaciones"
        actionLabel="Nueva organización"
        onActionClick={handleNuevaOrganizacion}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por ID, nombre, rubro, país o estado"
      />

      {cargando ? (
        <div className="p-8 text-center text-sm text-gray-500">
          Cargando organizaciones...
        </div>
      ) : (
        <Table
          columns={columns}
          data={organizacionesFiltradas}
          getRowKey={(row) => String(row.id)}
        />
      )}
    </div>
  )
}