package cr.ac.una.proyecto_integrador.Service;

import cr.ac.una.proyecto_integrador.Entidades.Control;
import cr.ac.una.proyecto_integrador.Entidades.Pregunta;
import cr.ac.una.proyecto_integrador.Repository.ControlRepository;
import cr.ac.una.proyecto_integrador.Repository.PreguntaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuestionarioService {

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private ControlRepository controlRepository;

    /**
     * Obtiene la lista completa de preguntas de la base de datos.
     */
    public List<Pregunta> obtenerTodasLasPreguntas() {
        return preguntaRepository.findAll();
    }

    /**
     * Obtiene las preguntas asociadas a un control específico.
     */
    public List<Pregunta> obtenerPreguntasPorControl(Integer idControl) {
        Control control = controlRepository.findById(idControl)
                .orElseThrow(() -> new RuntimeException("Control no encontrado ID: " + idControl));
        return preguntaRepository.findByControl(control);
    }
}