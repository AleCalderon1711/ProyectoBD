package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.Auditoria;
import cr.ac.una.proyecto_integrador.Entidades.*;
import cr.ac.una.proyecto_integrador.Enum.EstadoAuditoriaEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {

    List<Auditoria> findByOrganizacionIdOrganizacion(Integer idOrganizacion);

    List<Auditoria> findByAuditorIdUsuario(Integer idAuditor);

    List<Auditoria> findByDbaIdUsuario(Integer idDba);

    List<Auditoria> findByEstado(EstadoAuditoriaEnum estado);
}