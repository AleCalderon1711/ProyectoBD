package cr.ac.una.proyecto_integrador.Entidades;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "resultado_auditoria")
public class ResultadoAuditoria {

    @Id
    @Column(name = "id_auditoria")
    private Integer idAuditoria;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id_auditoria")
    private Auditoria auditoria;

    @Column(name = "cumplimiento_general", precision = 5, scale = 2)
    private BigDecimal cumplimientoGeneral;

    @Column(name = "exposicion_c", precision = 5, scale = 2)
    private BigDecimal exposicionC;

    @Column(name = "exposicion_i", precision = 5, scale = 2)
    private BigDecimal exposicionI;

    @Column(name = "exposicion_d", precision = 5, scale = 2)
    private BigDecimal exposicionD;

    @Column(name = "indice_general_riesgo", precision = 5, scale = 2)
    private BigDecimal indiceGeneralRiesgo;

    public ResultadoAuditoria() {
    }

    // Getters y Setters
    public Integer getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(Integer idAuditoria) {
        this.idAuditoria = idAuditoria;
    }

    public Auditoria getAuditoria() {
        return auditoria;
    }

    public void setAuditoria(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    public BigDecimal getCumplimientoGeneral() {
        return cumplimientoGeneral;
    }

    public void setCumplimientoGeneral(BigDecimal cumplimientoGeneral) {
        this.cumplimientoGeneral = cumplimientoGeneral;
    }

    public BigDecimal getExposicionC() {
        return exposicionC;
    }

    public void setExposicionC(BigDecimal exposicionC) {
        this.exposicionC = exposicionC;
    }

    public BigDecimal getExposicionI() {
        return exposicionI;
    }

    public void setExposicionI(BigDecimal exposicionI) {
        this.exposicionI = exposicionI;
    }

    public BigDecimal getExposicionD() {
        return exposicionD;
    }

    public void setExposicionD(BigDecimal exposicionD) {
        this.exposicionD = exposicionD;
    }

    public BigDecimal getIndiceGeneralRiesgo() {
        return indiceGeneralRiesgo;
    }

    public void setIndiceGeneralRiesgo(BigDecimal indiceGeneralRiesgo) {
        this.indiceGeneralRiesgo = indiceGeneralRiesgo;
    }
}
