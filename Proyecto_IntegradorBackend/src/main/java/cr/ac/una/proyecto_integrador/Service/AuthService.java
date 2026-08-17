package cr.ac.una.proyecto_integrador.Service;

import cr.ac.una.proyecto_integrador.Dto.Auth.JwtResponseDTO;
import cr.ac.una.proyecto_integrador.Dto.Auth.LoginRequestDTO;
import cr.ac.una.proyecto_integrador.Entidades.Usuario;
import cr.ac.una.proyecto_integrador.Repository.UsuarioRepository;
import cr.ac.una.proyecto_integrador.Security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public JwtResponseDTO autenticarUsuario(LoginRequestDTO loginRequest) {
        // Autentica credenciales (correo y contraseña)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getCorreo(),
                        loginRequest.getClave()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generarToken(authentication);

        Usuario usuario = usuarioRepository.findByCorreo(loginRequest.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el correo: " + loginRequest.getCorreo()));

        return new JwtResponseDTO(
                jwt,
                usuario.getIdUsuario(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }
}