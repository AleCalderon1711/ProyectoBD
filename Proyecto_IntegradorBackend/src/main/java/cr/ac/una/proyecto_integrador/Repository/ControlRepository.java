package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.Control;
import cr.ac.una.proyecto_integrador.Enum.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ControlRepository extends JpaRepository<Control, Integer> {

    Optional<Control> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    List<Control> findByDominio(DominioEnum dominio);
}