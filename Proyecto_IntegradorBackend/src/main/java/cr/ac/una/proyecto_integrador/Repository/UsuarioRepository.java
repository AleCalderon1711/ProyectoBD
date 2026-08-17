package cr.ac.una.proyecto_integrador.Repository;
import cr.ac.una.proyecto_integrador.Entidades.Usuario;
import cr.ac.una.proyecto_integrador.Enum.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    List<Usuario> findByRol(RolEnum rol);

    List<Usuario> findByActivoTrue();
}