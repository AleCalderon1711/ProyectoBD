package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.ResultadoAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResultadoAuditoriaRepository extends JpaRepository<ResultadoAuditoria, Integer> {

    Optional<ResultadoAuditoria> findByIdAuditoria(Integer idAuditoria);

    void deleteByIdAuditoria(Integer idAuditoria);
}