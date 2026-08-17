package cr.ac.una.proyecto_integrador.Entidades;

import cr.ac.una.proyecto_integrador.Enum.EstadoAuditoriaEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Integer idAuditoria;

    @NotNull(message = "La organización es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_organizacion", nullable = false)
    private Organizacion organizacion;

    @NotNull(message = "El auditor es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_auditor", nullable = false)
    private Usuario auditor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dba")
    private Usuario dba;

    @Column(name = "area_evaluada", length = 150)
    private String areaEvaluada;

    @NotNull(message = "La fecha de auditoría es obligatoria")
    @Column(name = "fecha_auditoria", nullable = false)
    private LocalDate fechaAuditoria;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoAuditoriaEnum estado = EstadoAuditoriaEnum.EN_PROGRESO;

    @Column(name = "peso_c", precision = 3, scale = 2)
    private BigDecimal pesoC = new BigDecimal("1.00");

    @Column(name = "peso_i", precision = 3, scale = 2)
    private BigDecimal pesoI = new BigDecimal("1.00");

    @Column(name = "peso_d", precision = 3, scale = 2)
    private BigDecimal pesoD = new BigDecimal("1.00");

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    public Auditoria() {
    }

    // Getters y Setters
    public Integer getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(Integer idAuditoria) {
        this.idAuditoria = idAuditoria;
    }

    public Organizacion getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(Organizacion organizacion) {
        this.organizacion = organizacion;
    }

    public Usuario getAuditor() {
        return auditor;
    }

    public void setAuditor(Usuario auditor) {
        this.auditor = auditor;
    }

    public Usuario getDba() {
        return dba;
    }

    public void setDba(Usuario dba) {
        this.dba = dba;
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

    public EstadoAuditoriaEnum getEstado() {
        return estado;
    }

    public void setEstado(EstadoAuditoriaEnum estado) {
        this.estado = estado;
    }

    public BigDecimal getPesoC() {
        return pesoC;
    }

    public void setPesoC(BigDecimal pesoC) {
        this.pesoC = pesoC;
    }

    public BigDecimal getPesoI() {
        return pesoI;
    }

    public void setPesoI(BigDecimal pesoI) {
        this.pesoI = pesoI;
    }

    public BigDecimal getPesoD() {
        return pesoD;
    }

    public void setPesoD(BigDecimal pesoD) {
        this.pesoD = pesoD;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}