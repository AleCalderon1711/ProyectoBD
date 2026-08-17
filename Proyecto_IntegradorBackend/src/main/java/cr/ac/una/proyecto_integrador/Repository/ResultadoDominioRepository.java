package cr.ac.una.proyecto_integrador.Repository;

import cr.ac.una.proyecto_integrador.Entidades.ResultadoDominio;
import cr.ac.una.proyecto_integrador.Enum.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultadoDominioRepository extends JpaRepository<ResultadoDominio, Integer> {

    List<ResultadoDominio> findByAuditoriaIdAuditoria(Integer idAuditoria);

    Optional<ResultadoDominio> findByAuditoriaIdAuditoriaAndDominio(Integer idAuditoria, DominioEnum dominio);

    void deleteByAuditoriaIdAuditoria(Integer idAuditoria);
}