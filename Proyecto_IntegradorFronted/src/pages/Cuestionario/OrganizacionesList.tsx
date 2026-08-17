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

  useEffect(() => {
    getOrganizaciones().then(setOrganizaciones)
  }, [])

  const handleNuevaOrganizacion = () => {
    navigate('/organizaciones/nueva')
  }
  const handleVer = (_id: string) => {}
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
      [organizacion.id, organizacion.nombre, organizacion.rubro, organizacion.pais, organizacion.estado]
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
          <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => handleVer(row.id)}>
            Ver
          </button>
          <button type="button" className="text-xs text-amber-600 hover:underline" onClick={() => handleEditar(row.id)}>
            Editar
          </button>
          <button
            type="button"
            className="text-xs text-emerald-600 hover:underline"
            onClick={() => handleIniciarAuditoria(row.id)}
          >
            Iniciar auditoría
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Organizaciones" actionLabel="Nueva organización" onActionClick={handleNuevaOrganizacion} />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por ID, nombre, rubro, país o estado"
      />

      <Table columns={columns} data={organizacionesFiltradas} getRowKey={(row) => row.id} />
    </div>
  )
}
