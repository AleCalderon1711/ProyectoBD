import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import { getOrganizacionById } from '../../api/organizaciones'
import axiosClient from '../../api/axiosClient'

interface OrganizacionFormData {
  nombre: string
  sector: string
  areaEvaluada: string
}

const initialFormData: OrganizacionFormData = {
  nombre: '',
  sector: '',
  areaEvaluada: '',
}

export default function OrganizacionForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = useMemo(() => Boolean(id), [id])

  const [formData, setFormData] = useState<OrganizacionFormData>(initialFormData)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!id) {
      setFormData(initialFormData)
      return
    }

    getOrganizacionById(id).then((organizacion) => {
      if (!organizacion) return

      setFormData({
        nombre: organizacion.nombre || '',
        sector: organizacion.rubro || '',
        areaEvaluada: '',
      })
    })
  }, [id])

  const handleChange = (field: keyof OrganizacionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      alert('Por favor ingrese el nombre de la organización.')
      return
    }

    setCargando(true)
    try {
      if (isEditMode && id) {
        await axiosClient.put(`/organizaciones/${id}`, {
          nombre: formData.nombre,
          rubro: formData.sector,
        })
      } else {
        await axiosClient.post('/organizaciones', {
          nombre: formData.nombre,
          rubro: formData.sector,
          pais: 'Costa Rica',
          estado: 'Activo',
        })
      }
      navigate('/organizaciones')
    } catch (error) {
      console.error('Error al guardar la organización:', error)
      // Redirige de todos modos para permitir continuar la navegación en entorno de pruebas
      navigate('/organizaciones')
    } finally {
      setCargando(false)
    }
  }

  const handleCancelar = () => {
    navigate('/organizaciones')
  }

  return (
    <div>
      <PageHeader title={isEditMode ? 'Editar Organización' : 'Nueva Organización'} />

      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="mb-4">
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            value={formData.nombre}
            onChange={(event) => handleChange('nombre', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sector" className="mb-1 block text-sm font-medium text-gray-700">
            Sector
          </label>
          <input
            id="sector"
            type="text"
            value={formData.sector}
            onChange={(event) => handleChange('sector', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="area-evaluada" className="mb-1 block text-sm font-medium text-gray-700">
            Área evaluada
          </label>
          <input
            id="area-evaluada"
            type="text"
            value={formData.areaEvaluada}
            onChange={(event) => handleChange('areaEvaluada', event.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={cargando}
            className="rounded bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {cargando ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={handleCancelar}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}