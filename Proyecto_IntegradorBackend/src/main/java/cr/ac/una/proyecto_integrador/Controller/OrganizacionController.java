package cr.ac.una.proyecto_integrador.Controller;

import cr.ac.una.proyecto_integrador.Entidades.Organizacion;
import cr.ac.una.proyecto_integrador.Repository.OrganizacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizacionController {

    private final OrganizacionRepository organizacionRepository;

    @GetMapping
    public ResponseEntity<List<Organizacion>> getOrganizaciones() {
        return ResponseEntity.ok(organizacionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organizacion> getOrganizacionById(@PathVariable Integer id) {
        return organizacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Organizacion> createOrganizacion(@RequestBody Organizacion organizacion) {
        Organizacion nueva = organizacionRepository.save(organizacion);
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organizacion> updateOrganizacion(@PathVariable Integer id, @RequestBody Organizacion organizacion) {
        return organizacionRepository.findById(id)
                .map(existente -> {
                    // Copia o mapea los campos que quieras actualizar
                    organizacion.setIdOrganizacion(id);
                    return ResponseEntity.ok(organizacionRepository.save(organizacion));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}