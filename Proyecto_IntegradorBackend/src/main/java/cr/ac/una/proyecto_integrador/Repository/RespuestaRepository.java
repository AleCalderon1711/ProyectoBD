package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.Auditoria;
import cr.ac.una.proyecto_integrador.Entidades.Pregunta;
import cr.ac.una.proyecto_integrador.Entidades.Respuesta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RespuestaRepository extends JpaRepository<Respuesta, Integer> {

    List<Respuesta> findByAuditoriaIdAuditoria(Integer idAuditoria);

    Optional<Respuesta> findByAuditoriaIdAuditoriaAndPreguntaIdPregunta(Integer idAuditoria, Integer idPregunta);

    List<Respuesta> findByAuditoriaIdAuditoriaAndPreguntaControlIdControl(Integer idAuditoria, Integer idControl);

    Optional<Respuesta> findByAuditoriaAndPregunta(Auditoria auditoria, Pregunta pregunta);

    List<Respuesta> findByAuditoria(Auditoria auditoria);

    void deleteByAuditoriaIdAuditoria(Integer idAuditoria);





}