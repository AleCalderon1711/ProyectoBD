package cr.ac.una.proyecto_integrador.Dto.Auditoria;

import cr.ac.una.proyecto_integrador.Enum.ValorRespuestaEnum;
import jakarta.validation.constraints.NotNull;

public class GuardarRespuestaDTO {

    @NotNull
    private Integer idPregunta;

    @NotNull
    private ValorRespuestaEnum valor;

    private String evidencia;

    // Getters y Setters
    public Integer getIdPregunta() {
        return idPregunta;
    }

    public void setIdPregunta(Integer idPregunta) {
        this.idPregunta = idPregunta;
    }

    public ValorRespuestaEnum getValor() {
        return valor;
    }

    public void setValor(ValorRespuestaEnum valor) {
        this.valor = valor;
    }

    public String getEvidencia() {
        return evidencia;
    }

    public void setEvidencia(String evidencia) {
        this.evidencia = evidencia;
    }
}