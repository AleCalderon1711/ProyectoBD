package cr.ac.una.proyecto_integrador.Entidades;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(
        name = "resultado_control",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_aud_control", columnNames = {"id_auditoria", "id_control"})
        }
)
public class ResultadoControl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado_control")
    private Integer idResultadoControl;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_auditoria", nullable = false)
    private Auditoria auditoria;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_control", nullable = false)
    private Control control;

    @Column(name = "aplica")
    private Boolean aplica = true;

    @Column(name = "nivel_madurez")
    private Integer nivelMadurez;

    @Column(name = "cumplimiento_pct", precision = 5, scale = 2)
    private BigDecimal cumplimientoPct;

    @Column(name = "riesgo_c", precision = 8, scale = 4)
    private BigDecimal riesgoC;

    @Column(name = "riesgo_i", precision = 8, scale = 4)
    private BigDecimal riesgoI;

    @Column(name = "riesgo_d", precision = 8, scale = 4)
    private BigDecimal riesgoD;

    public ResultadoControl() {
    }

    // Getters y Setters
    public Integer getIdResultadoControl() {
        return idResultadoControl;
    }

    public void setIdResultadoControl(Integer idResultadoControl) {
        this.idResultadoControl = idResultadoControl;
    }

    public Auditoria getAuditoria() {
        return auditoria;
    }

    public void setAuditoria(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    public Control getControl() {
        return control;
    }

    public void setControl(Control control) {
        this.control = control;
    }

    public Boolean getAplica() {
        return aplica;
    }

    public void setAplica(Boolean aplica) {
        this.aplica = aplica;
    }

    public Integer getNivelMadurez() {
        return nivelMadurez;
    }

    public void setNivelMadurez(Integer nivelMadurez) {
        this.nivelMadurez = nivelMadurez;
    }

    public BigDecimal getCumplimientoPct() {
        return cumplimientoPct;
    }

    public void setCumplimientoPct(BigDecimal cumplimientoPct) {
        this.cumplimientoPct = cumplimientoPct;
    }

    public BigDecimal getRiesgoC() {
        return riesgoC;
    }

    public void setRiesgoC(BigDecimal riesgoC) {
        this.riesgoC = riesgoC;
    }

    public BigDecimal getRiesgoI() {
        return riesgoI;
    }

    public void setRiesgoI(BigDecimal riesgoI) {
        this.riesgoI = riesgoI;
    }

    public BigDecimal getRiesgoD() {
        return riesgoD;
    }

    public void setRiesgoD(BigDecimal riesgoD) {
        this.riesgoD = riesgoD;
    }
}