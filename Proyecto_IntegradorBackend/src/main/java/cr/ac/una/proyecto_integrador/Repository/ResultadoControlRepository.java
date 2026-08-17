package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.Auditoria;
import cr.ac.una.proyecto_integrador.Entidades.Control;
import cr.ac.una.proyecto_integrador.Entidades.ResultadoControl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultadoControlRepository extends JpaRepository<ResultadoControl, Integer> {

    List<ResultadoControl> findByAuditoriaIdAuditoria(Integer idAuditoria);

    Optional<ResultadoControl> findByAuditoriaIdAuditoriaAndControlIdControl(Integer idAuditoria, Integer idControl);

    Optional<ResultadoControl> findByAuditoriaAndControl(Auditoria auditoria, Control control);

    void deleteByAuditoriaIdAuditoria(Integer idAuditoria);
}