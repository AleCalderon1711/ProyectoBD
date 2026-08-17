package cr.ac.una.proyecto_integrador.Service;

import cr.ac.una.proyecto_integrador.Dto.Auditoria.AuditoriaCrearDTO;
import cr.ac.una.proyecto_integrador.Dto.Auditoria.GuardarRespuestaDTO;
import cr.ac.una.proyecto_integrador.Dto.Auditoria.RegistrarRespuestasBatchDTO;
import cr.ac.una.proyecto_integrador.Entidades.*;
import cr.ac.una.proyecto_integrador.Enum.EstadoAuditoriaEnum;
import cr.ac.una.proyecto_integrador.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository auditoriaRepository;

    @Autowired
    private OrganizacionRepository organizacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PreguntaRepository preguntaRepository;

    @Autowired
    private RespuestaRepository respuestaRepository;

    @Autowired
    private ControlRepository controlRepository;

    @Autowired
    private ResultadoControlRepository resultadoControlRepository;

    @Autowired
    private EvaluacionService evaluacionService;

    @Transactional
    public Auditoria crearAuditoria(AuditoriaCrearDTO dto) {
        Organizacion org = organizacionRepository.findById(dto.getIdOrganizacion())
                .orElseThrow(() -> new RuntimeException("Organización no encontrada ID: " + dto.getIdOrganizacion()));

        Usuario auditor = usuarioRepository.findById(dto.getIdAuditor())
                .orElseThrow(() -> new RuntimeException("Auditor no encontrado ID: " + dto.getIdAuditor()));

        Usuario dba = null;
        if (dto.getIdDba() != null) {
            dba = usuarioRepository.findById(dto.getIdDba()).orElse(null);
        }

        Auditoria auditoria = new Auditoria();
        auditoria.setOrganizacion(org);
        auditoria.setAuditor(auditor);
        auditoria.setDba(dba);
        auditoria.setAreaEvaluada(dto.getAreaEvaluada());
        auditoria.setFechaAuditoria(dto.getFechaAuditoria());
        auditoria.setEstado(EstadoAuditoriaEnum.EN_PROGRESO);
        auditoria.setFechaCreacion(LocalDateTime.now());

        return auditoriaRepository.save(auditoria);
    }

    @Transactional
    public void registrarRespuestasBatch(RegistrarRespuestasBatchDTO batchDTO) {
        Auditoria auditoria = auditoriaRepository.findById(batchDTO.getIdAuditoria())
                .orElseThrow(() -> new RuntimeException("Auditoría no encontrada ID: " + batchDTO.getIdAuditoria()));

        for (GuardarRespuestaDTO item : batchDTO.getRespuestas()) {
            Pregunta pregunta = preguntaRepository.findById(item.getIdPregunta())
                    .orElseThrow(() -> new RuntimeException("Pregunta no encontrada ID: " + item.getIdPregunta()));

            Optional<Respuesta> optRespuesta = respuestaRepository.findByAuditoriaAndPregunta(auditoria, pregunta);

            Respuesta respuesta = optRespuesta.orElseGet(Respuesta::new);
            respuesta.setAuditoria(auditoria);
            respuesta.setPregunta(pregunta);
            respuesta.setValor(item.getValor());
            respuesta.setEvidencia(item.getEvidencia());
            respuesta.setFechaRegistro(LocalDateTime.now());

            respuestaRepository.save(respuesta);
        }

        recalcularResultadosAuditoria(auditoria);
    }

    private void recalcularResultadosAuditoria(Auditoria auditoria) {
        List<Control> controles = controlRepository.findAll();
        List<Respuesta> respuestasGuardadas = respuestaRepository.findByAuditoria(auditoria);

        for (Control control : controles) {
            List<Pregunta> preguntasDelControl = preguntaRepository.findByControl(control);

            if (preguntasDelControl.isEmpty()) continue;

            // 1. Calcular nivel de madurez y porcentaje de cumplimiento
            int nivelMadurez = evaluacionService.calcularNivelMadurezControl(preguntasDelControl, respuestasGuardadas);
            BigDecimal cumplimientoPct = evaluacionService.calcularPorcentajeCumplimiento(nivelMadurez);

            // 2. Calcular riesgos por dimensión C, I, D usando los coeficientes de Control
            BigDecimal riesgoC = evaluacionService.calcularRiesgoDimension(cumplimientoPct, control.getPeso(), control.getCoefC());
            BigDecimal riesgoI = evaluacionService.calcularRiesgoDimension(cumplimientoPct, control.getPeso(), control.getCoefI());
            BigDecimal riesgoD = evaluacionService.calcularRiesgoDimension(cumplimientoPct, control.getPeso(), control.getCoefD());

            // 3. Mapear y guardar en ResultadoControl
            Optional<ResultadoControl> optResultado = resultadoControlRepository.findByAuditoriaAndControl(auditoria, control);
            ResultadoControl resultado = optResultado.orElseGet(ResultadoControl::new);

            resultado.setAuditoria(auditoria);
            resultado.setControl(control);
            resultado.setNivelMadurez(nivelMadurez);
            resultado.setCumplimientoPct(cumplimientoPct);
            resultado.setRiesgoC(riesgoC);
            resultado.setRiesgoI(riesgoI);
            resultado.setRiesgoD(riesgoD);

            resultadoControlRepository.save(resultado);
        }
    }
}