package cr.ac.una.proyecto_integrador.Controller;

import cr.ac.una.proyecto_integrador.Entidades.Control;
import cr.ac.una.proyecto_integrador.Repository.ControlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/controles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ControlController {

    private final ControlRepository controlRepository;

    @GetMapping
    public ResponseEntity<List<Control>> getControles() {
        // Trae todos los controles ISO 27002 con sus preguntas cargadas
        return ResponseEntity.ok(controlRepository.findAll());
    }
}