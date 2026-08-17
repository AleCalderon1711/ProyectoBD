package cr.ac.una.proyecto_integrador.Dto.Auditoria;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AuditoriaCrearDTO {

    @NotNull
    private Integer idOrganizacion;

    @NotNull
    private Integer idAuditor;

    private Integer idDba; // Opcional
    private String areaEvaluada;

    @NotNull
    private LocalDate fechaAuditoria;

    // Getters y Setters
    public Integer getIdOrganizacion() {
        return idOrganizacion;
    }

    public void setIdOrganizacion(Integer idOrganizacion) {
        this.idOrganizacion = idOrganizacion;
    }

    public Integer getIdAuditor() {
        return idAuditor;
    }

    public void setIdAuditor(Integer idAuditor) {
        this.idAuditor = idAuditor;
    }

    public Integer getIdDba() {
        return idDba;
    }

    public void setIdDba(Integer idDba) {
        this.idDba = idDba;
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
}