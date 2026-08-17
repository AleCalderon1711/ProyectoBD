package cr.ac.una.proyecto_integrador.Entidades;

import cr.ac.una.proyecto_integrador.Enum.DominioEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(
        name = "resultado_dominio",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_aud_dominio", columnNames = {"id_auditoria", "dominio"})
        }
)
public class ResultadoDominio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado_dominio")
    private Integer idResultadoDominio;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_auditoria", nullable = false)
    private Auditoria auditoria;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "dominio", nullable = false)
    private DominioEnum dominio;

    @Column(name = "cumplimiento_pct", precision = 5, scale = 2)
    private BigDecimal cumplimientoPct;

    public ResultadoDominio() {
    }

    // Getters y Setters
    public Integer getIdResultadoDominio() {
        return idResultadoDominio;
    }

    public void setIdResultadoDominio(Integer idResultadoDominio) {
        this.idResultadoDominio = idResultadoDominio;
    }

    public Auditoria getAuditoria() {
        return auditoria;
    }

    public void setAuditoria(Auditoria auditoria) {
        this.auditoria = auditoria;
    }

    public DominioEnum getDominio() {
        return dominio;
    }

    public void setDominio(DominioEnum dominio) {
        this.dominio = dominio;
    }

    public BigDecimal getCumplimientoPct() {
        return cumplimientoPct;
    }

    public void setCumplimientoPct(BigDecimal cumplimientoPct) {
        this.cumplimientoPct = cumplimientoPct;
    }
}