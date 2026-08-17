package cr.ac.una.proyecto_integrador.Repository;
import cr.ac.una.proyecto_integrador.Entidades.Organizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizacionRepository extends JpaRepository<Organizacion, Integer> {

    Optional<Organizacion> findByNombre(String nombre);



    boolean existsByNombre(String nombre);
}
