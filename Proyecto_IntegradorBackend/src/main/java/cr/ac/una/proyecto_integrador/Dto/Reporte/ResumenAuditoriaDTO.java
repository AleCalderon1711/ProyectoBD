package cr.ac.una.proyecto_integrador.Dto.Reporte;

import java.time.LocalDate;

public class ResumenAuditoriaDTO {

    private Integer idAuditoria;
    private String nombreOrganizacion;
    private String areaEvaluada;
    private LocalDate fechaAuditoria;
    private String estado;

    // Métricas para Gráficos y Dashboard
    private Double porcentajeCumplimientoGlobal;
    private Double nivelMadurezPromedio;
    private Double exposicionConfidencialidad;
    private Double exposicionIntegridad;
    private Double exposicionDisponibilidad;

    // Constructores
    public ResumenAuditoriaDTO() {
    }

    public ResumenAuditoriaDTO(Integer idAuditoria, String nombreOrganizacion, String areaEvaluada,
                               LocalDate fechaAuditoria, String estado, Double porcentajeCumplimientoGlobal,
                               Double nivelMadurezPromedio, Double exposicionConfidencialidad,
                               Double exposicionIntegridad, Double exposicionDisponibilidad) {
        this.idAuditoria = idAuditoria;
        this.nombreOrganizacion = nombreOrganizacion;
        this.areaEvaluada = areaEvaluada;
        this.fechaAuditoria = fechaAuditoria;
        this.estado = estado;
        this.porcentajeCumplimientoGlobal = porcentajeCumplimientoGlobal;
        this.nivelMadurezPromedio = nivelMadurezPromedio;
        this.exposicionConfidencialidad = exposicionConfidencialidad;
        this.exposicionIntegridad = exposicionIntegridad;
        this.exposicionDisponibilidad = exposicionDisponibilidad;
    }

    // Getters y Setters
    public Integer getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(Integer idAuditoria) {
        this.idAuditoria = idAuditoria;
    }

    public String getNombreOrganizacion() {
        return nombreOrganizacion;
    }

    public void setNombreOrganizacion(String nombreOrganizacion) {
        this.nombreOrganizacion = nombreOrganizacion;
    }

    public String getAreaEvaluada() {
        return areaEvaluada;
    }

    public void setAreaEvaluada(String areaEvaluada) {
        this.areaEvaluada = areaEvaluada;
    }

    public LocalDate getFechaAuditoria() {
        return fechaAuditoria;
    }

    public void setFechaAuditoria(LocalDate fechaAuditoria) {
        this.fechaAuditoria = fechaAuditoria;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Double getPorcentajeCumplimientoGlobal() {
        return porcentajeCumplimientoGlobal;
    }

    public void setPorcentajeCumplimientoGlobal(Double porcentajeCumplimientoGlobal) {
        this.porcentajeCumplimientoGlobal = porcentajeCumplimientoGlobal;
    }

    public Double getNivelMadurezPromedio() {
        return nivelMadurezPromedio;
    }

    public void setNivelMadurezPromedio(Double nivelMadurezPromedio) {
        this.nivelMadurezPromedio = nivelMadurezPromedio;
    }

    public Double getExposicionConfidencialidad() {
        return exposicionConfidencialidad;
    }

    public void setExposicionConfidencialidad(Double exposicionConfidencialidad) {
        this.exposicionConfidencialidad = exposicionConfidencialidad;
    }

    public Double getExposicionIntegridad() {
        return exposicionIntegridad;
    }

    public void setExposicionIntegridad(Double exposicionIntegridad) {
        this.exposicionIntegridad = exposicionIntegridad;
    }

    public Double getExposicionDisponibilidad() {
        return exposicionDisponibilidad;
    }

    public void setExposicionDisponibilidad(Double exposicionDisponibilidad) {
        this.exposicionDisponibilidad = exposicionDisponibilidad;
    }
}