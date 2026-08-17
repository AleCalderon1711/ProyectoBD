package cr.ac.una.proyecto_integrador.Controller;

import cr.ac.una.proyecto_integrador.Entidades.Auditoria;
import cr.ac.una.proyecto_integrador.Repository.AuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditoriaController {

    private final AuditoriaRepository auditoriaRepository;

    @GetMapping
    public ResponseEntity<List<Auditoria>> getAuditorias() {
        return ResponseEntity.ok(auditoriaRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Auditoria> createAuditoria(@RequestBody Auditoria auditoria) {
        Auditoria nueva = auditoriaRepository.save(auditoria);
        return ResponseEntity.ok(nueva);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auditoria> getAuditoriaById(@PathVariable Integer id) {
        return auditoriaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}