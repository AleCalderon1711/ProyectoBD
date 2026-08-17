package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.Control;
import cr.ac.una.proyecto_integrador.Entidades.Pregunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PreguntaRepository extends JpaRepository<Pregunta, Integer> {

    List<Pregunta> findByControl(Control control);

   List<Pregunta> findByControlIdControl(Integer idControl);

    List<Pregunta> findByControlCodigoOrderByNivelAsc(String codigoControl);

    Optional<Pregunta> findByControlIdControlAndNivel(Integer idControl, Integer nivel);
}