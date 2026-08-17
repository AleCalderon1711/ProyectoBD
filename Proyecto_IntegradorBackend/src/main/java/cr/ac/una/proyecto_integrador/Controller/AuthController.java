package cr.ac.una.proyecto_integrador.Controller;

import cr.ac.una.proyecto_integrador.Entidades.Usuario;
import cr.ac.una.proyecto_integrador.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String correo = payload.get("correo");
        String contrasena = payload.get("contrasena");

        // Busca el usuario en la BD por correo
        return usuarioRepository.findByCorreo(correo)
                .map(usuario -> {
                    // Validar contraseña (aquí podrías usar PasswordEncoder de Spring Security)
                    if (usuario.getClaveHash().equals(contrasena)) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("token", "jwt-token-" + usuario.getIdUsuario());
                        response.put("usuario", usuario);
                        return ResponseEntity.ok(response);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no encontrado"));
    }
}