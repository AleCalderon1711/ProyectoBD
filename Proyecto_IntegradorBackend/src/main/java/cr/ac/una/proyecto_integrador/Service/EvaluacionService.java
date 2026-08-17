package cr.ac.una.proyecto_integrador.Service;

import cr.ac.una.proyecto_integrador.Entidades.Pregunta;
import cr.ac.una.proyecto_integrador.Entidades.Respuesta;
import cr.ac.una.proyecto_integrador.Enum.ValorRespuestaEnum;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
public class EvaluacionService {

    /**
     * Determina el nivel de madurez (0 a 5) alcanzado en un control.
     */
    public int calcularNivelMadurezControl(List<Pregunta> preguntasControl, List<Respuesta> respuestasControl) {
        preguntasControl.sort(Comparator.comparingInt(Pregunta::getNivel));

        int nivelAlcanzado = 0;

        for (Pregunta pregunta : preguntasControl) {
            Respuesta resp = respuestasControl.stream()
                    .filter(r -> r.getPregunta().getIdPregunta().equals(pregunta.getIdPregunta()))
                    .findFirst()
                    .orElse(null);

            if (resp != null && (resp.getValor() == ValorRespuestaEnum.SI || resp.getValor() == ValorRespuestaEnum.NA)) {
                if (pregunta.getNivel() == nivelAlcanzado + 1) {
                    nivelAlcanzado = pregunta.getNivel();
                }
            } else {
                break;
            }
        }

        return nivelAlcanzado;
    }

    /**
     * Calcula el porcentaje de cumplimiento: (Nivel / 5) * 100
     */
    public BigDecimal calcularPorcentajeCumplimiento(int nivelMadurez) {
        double pct = (nivelMadurez / 5.0) * 100.0;
        return BigDecimal.valueOf(pct).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calcula el nivel de riesgo específico para un coeficiente CID.
     * Riesgo = (100 - % Cumplimiento) * Peso * Coeficiente
     */
    public BigDecimal calcularRiesgoDimension(BigDecimal cumplimientoPct, Integer peso, BigDecimal coef) {
        if (coef == null || peso == null) return BigDecimal.ZERO;

        BigDecimal brechaPct = BigDecimal.valueOf(100).subtract(cumplimientoPct);
        BigDecimal pesoBD = BigDecimal.valueOf(peso);

        // Brecha * Peso * Coeficiente
        return brechaPct.multiply(pesoBD).multiply(coef).setScale(4, RoundingMode.HALF_UP);
    }
}