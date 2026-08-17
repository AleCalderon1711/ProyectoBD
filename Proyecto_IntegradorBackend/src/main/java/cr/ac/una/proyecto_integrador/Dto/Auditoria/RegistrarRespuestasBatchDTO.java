package cr.ac.una.proyecto_integrador.Dto.Auditoria;

import java.util.List;

public class RegistrarRespuestasBatchDTO {

    private Integer idAuditoria;
    private List<GuardarRespuestaDTO> respuestas;

    // Getters y Setters
    public Integer getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(Integer idAuditoria) {
        this.idAuditoria = idAuditoria;
    }

    public List<GuardarRespuestaDTO> getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(List<GuardarRespuestaDTO> respuestas) {
        this.respuestas = respuestas;
    }
}