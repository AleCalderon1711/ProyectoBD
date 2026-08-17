package cr.ac.una.proyecto_integrador.Entidades;
import cr.ac.una.proyecto_integrador.Enum.DominioEnum;
import cr.ac.una.proyecto_integrador.Enum.RelacionCidEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "control")
public class Control {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_control")
    private Integer idControl;

    @NotBlank(message = "El código no puede estar vacío")
    @Size(max = 10, message = "El código no puede superar 10 caracteres")
    @Column(name = "codigo", nullable = false, unique = true, length = 10)
    private String codigo;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @NotNull(message = "El dominio es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "dominio", nullable = false)
    private DominioEnum dominio;

    @Lob
    @Column(name = "objetivo", columnDefinition = "TEXT")
    private String objetivo;

    @Lob
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El peso es obligatorio")
    @Min(value = 1, message = "El peso mínimo es 1")
    @Max(value = 5, message = "El peso máximo es 5")
    @Column(name = "peso", nullable = false)
    private Integer peso;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_c", nullable = false)
    private RelacionCidEnum relacionC;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_i", nullable = false)
    private RelacionCidEnum relacionI;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_d", nullable = false)
    private RelacionCidEnum relacionD;

    @NotNull
    @Column(name = "coef_c", nullable = false, precision = 2, scale = 1)
    private BigDecimal coefC;

    @NotNull
    @Column(name = "coef_i", nullable = false, precision = 2, scale = 1)
    private BigDecimal coefI;

    @NotNull
    @Column(name = "coef_d", nullable = false, precision = 2, scale = 1)
    private BigDecimal coefD;

    public Control() {
    }

    public Control(String codigo, String nombre, DominioEnum dominio, Integer peso,
                   RelacionCidEnum relacionC, RelacionCidEnum relacionI, RelacionCidEnum relacionD,
                   BigDecimal coefC, BigDecimal coefI, BigDecimal coefD) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.dominio = dominio;
        this.peso = peso;
        this.relacionC = relacionC;
        this.relacionI = relacionI;
        this.relacionD = relacionD;
        this.coefC = coefC;
        this.coefI = coefI;
        this.coefD = coefD;
    }

    // Getters y Setters
    public Integer getIdControl() {
        return idControl;
    }

    public void setIdControl(Integer idControl) {
        this.idControl = idControl;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public DominioEnum getDominio() {
        return dominio;
    }

    public void setDominio(DominioEnum dominio) {
        this.dominio = dominio;
    }

    public String getObjetivo() {
        return objetivo;
    }

    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getPeso() {
        return peso;
    }

    public void setPeso(Integer peso) {
        this.peso = peso;
    }

    public RelacionCidEnum getRelacionC() {
        return relacionC;
    }

    public void setRelacionC(RelacionCidEnum relacionC) {
        this.relacionC = relacionC;
    }

    public RelacionCidEnum getRelacionI() {
        return relacionI;
    }

    public void setRelacionI(RelacionCidEnum relacionI) {
        this.relacionI = relacionI;
    }

    public RelacionCidEnum getRelacionD() {
        return relacionD;
    }

    public void setRelacionD(RelacionCidEnum relacionD) {
        this.relacionD = relacionD;
    }

    public BigDecimal getCoefC() {
        return coefC;
    }

    public void setCoefC(BigDecimal coefC) {
        this.coefC = coefC;
    }

    public BigDecimal getCoefI() {
        return coefI;
    }

    public void setCoefI(BigDecimal coefI) {
        this.coefI = coefI;
    }

    public BigDecimal getCoefD() {
        return coefD;
    }

    public void setCoefD(BigDecimal coefD) {
        this.coefD = coefD;
    }
}
