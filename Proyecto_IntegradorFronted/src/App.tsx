import React, { useState, useMemo } from "react";

/* ============================================================
   DATOS: Controles ISO/IEC 27002:2022 aplicables a
   Administración de Bases de Datos, organizados en los 4
   dominios oficiales de la norma (Organizacional, Personas,
   Físico, Tecnológico).
   ============================================================ */

const DOMAINS = [
  { id: "org", name: "Organizacional", color: "#5B8DEF" },
  { id: "people", name: "Personas", color: "#B98DF7" },
  { id: "phys", name: "Físico", color: "#F5A623" },
  { id: "tech", name: "Tecnológico", color: "#3DDC84" },
];

const CONTROLS = [
  {
    id: "5.9",
    domain: "org",
    name: "Inventario de activos de información",
    goal: "Mantener identificados y clasificados los activos de bases de datos y su información.",
    weight: 8,
    cid: { c: 2, i: 2, d: 1 },
    questions: [
      "¿Existe un inventario actualizado de todas las bases de datos de la organización?",
      "¿Cada base de datos tiene un propietario (owner) formalmente asignado?",
    ],
  },
  {
    id: "5.10",
    domain: "org",
    name: "Uso aceptable de los activos",
    goal: "Definir reglas de uso aceptable para los datos y motores de bases de datos.",
    weight: 5,
    cid: { c: 2, i: 1, d: 0 },
    questions: [
      "¿Existe una política de uso aceptable específica para el acceso a bases de datos?",
    ],
  },
  {
    id: "5.12",
    domain: "org",
    name: "Clasificación de la información",
    goal: "Clasificar la información contenida en las bases de datos según su sensibilidad.",
    weight: 9,
    cid: { c: 3, i: 1, d: 0 },
    questions: [
      "¿La información almacenada en las bases de datos está clasificada (pública, interna, confidencial, restringida)?",
      "¿Los campos que contienen datos sensibles o personales están identificados explícitamente?",
    ],
  },
  {
    id: "5.15",
    domain: "org",
    name: "Control de acceso",
    goal: "Restringir el acceso lógico a las bases de datos según necesidad de conocer.",
    weight: 10,
    cid: { c: 3, i: 2, d: 1 },
    questions: [
      "¿Existe una política formal de control de acceso a las bases de datos?",
      "¿Los permisos se otorgan bajo el principio de mínimo privilegio?",
    ],
  },
  {
    id: "5.18",
    domain: "org",
    name: "Derechos de acceso",
    goal: "Gestionar el ciclo de vida de altas, bajas y modificación de accesos a la BD.",
    weight: 9,
    cid: { c: 3, i: 2, d: 0 },
    questions: [
      "¿Se revisan periódicamente los derechos de acceso otorgados a usuarios y aplicaciones?",
      "¿Los accesos se revocan de forma inmediata al finalizar la relación laboral o cambio de rol?",
    ],
  },
  {
    id: "5.23",
    domain: "org",
    name: "Seguridad de la información en servicios en la nube",
    goal: "Asegurar bases de datos alojadas en proveedores cloud (DBaaS).",
    weight: 6,
    cid: { c: 2, i: 1, d: 2 },
    questions: [
      "Si la base de datos está en la nube, ¿existe un acuerdo de nivel de servicio (SLA) de seguridad con el proveedor?",
    ],
  },
  {
    id: "5.29",
    domain: "org",
    name: "Seguridad de la información ante interrupciones",
    goal: "Garantizar continuidad de acceso a la base de datos ante incidentes.",
    weight: 7,
    cid: { c: 0, i: 1, d: 3 },
    questions: [
      "¿Existe un plan de continuidad que contemple la indisponibilidad de la base de datos?",
    ],
  },
  {
    id: "5.34",
    domain: "org",
    name: "Privacidad y protección de datos personales",
    goal: "Cumplir normativa de protección de datos personales almacenados en BD.",
    weight: 9,
    cid: { c: 3, i: 1, d: 0 },
    questions: [
      "¿Existe un procedimiento documentado para atender solicitudes sobre datos personales (acceso, rectificación, eliminación)?",
    ],
  },
  {
    id: "6.3",
    domain: "people",
    name: "Concienciación, educación y capacitación",
    goal: "Capacitar al personal de TI/DBA en seguridad de bases de datos.",
    weight: 6,
    cid: { c: 1, i: 1, d: 0 },
    questions: [
      "¿El personal que administra bases de datos recibe capacitación periódica en seguridad de la información?",
    ],
  },
  {
    id: "6.6",
    domain: "people",
    name: "Acuerdos de confidencialidad",
    goal: "Formalizar confidencialidad para quienes acceden a datos sensibles.",
    weight: 5,
    cid: { c: 3, i: 0, d: 0 },
    questions: [
      "¿El personal con acceso a datos sensibles ha firmado acuerdos de confidencialidad (NDA)?",
    ],
  },
  {
    id: "7.1",
    domain: "phys",
    name: "Perímetro de seguridad física",
    goal: "Proteger físicamente los servidores donde reside la base de datos.",
    weight: 6,
    cid: { c: 1, i: 1, d: 2 },
    questions: [
      "¿El(los) servidor(es) de base de datos se encuentra(n) en un área con acceso físico restringido?",
    ],
  },
  {
    id: "7.9",
    domain: "phys",
    name: "Seguridad de equipos fuera de las instalaciones",
    goal: "Proteger réplicas o respaldos físicos fuera del sitio principal.",
    weight: 4,
    cid: { c: 2, i: 1, d: 1 },
    questions: [
      "¿Los medios físicos de respaldo (cintas, discos) almacenados fuera del sitio tienen protección adecuada?",
    ],
  },
  {
    id: "7.10",
    domain: "phys",
    name: "Medios de almacenamiento",
    goal: "Gestionar de forma segura los medios que contienen datos de la BD.",
    weight: 5,
    cid: { c: 2, i: 1, d: 1 },
    questions: [
      "¿Existe un procedimiento seguro de destrucción o borrado de medios que contuvieron datos de la BD?",
    ],
  },
  {
    id: "8.2",
    domain: "tech",
    name: "Derechos de acceso privilegiado",
    goal: "Controlar cuentas administrativas (sa, root, DBA) de la base de datos.",
    weight: 10,
    cid: { c: 3, i: 3, d: 1 },
    questions: [
      "¿Las cuentas con privilegios administrativos en la base de datos están limitadas al mínimo personal necesario?",
      "¿Las acciones realizadas con cuentas privilegiadas quedan registradas de forma auditable?",
    ],
  },
  {
    id: "8.3",
    domain: "tech",
    name: "Restricción de acceso a la información",
    goal: "Limitar el acceso a nivel de tabla, vista o registro según el rol.",
    weight: 9,
    cid: { c: 3, i: 2, d: 0 },
    questions: [
      "¿El acceso a datos está restringido mediante roles y perfiles definidos dentro del motor de base de datos?",
    ],
  },
  {
    id: "8.5",
    domain: "tech",
    name: "Autenticación segura",
    goal: "Exigir autenticación robusta para el acceso a la base de datos.",
    weight: 9,
    cid: { c: 3, i: 2, d: 0 },
    questions: [
      "¿El acceso a la base de datos requiere autenticación individual (no cuentas compartidas)?",
      "¿Se exige autenticación multifactor para accesos administrativos remotos?",
    ],
  },
  {
    id: "8.8",
    domain: "tech",
    name: "Gestión de vulnerabilidades técnicas",
    goal: "Identificar y remediar vulnerabilidades del motor de base de datos.",
    weight: 8,
    cid: { c: 2, i: 2, d: 2 },
    questions: [
      "¿Se aplican parches y actualizaciones de seguridad al motor de base de datos de forma periódica?",
      "¿Se realizan escaneos de vulnerabilidades sobre la infraestructura de base de datos?",
    ],
  },
  {
    id: "8.9",
    domain: "tech",
    name: "Gestión de la configuración",
    goal: "Mantener configuraciones seguras y documentadas del motor de BD (hardening).",
    weight: 8,
    cid: { c: 2, i: 2, d: 1 },
    questions: [
      "¿Existe una línea base de configuración segura (hardening) aplicada al motor de base de datos?",
    ],
  },
  {
    id: "8.10",
    domain: "tech",
    name: "Eliminación de información",
    goal: "Asegurar el borrado seguro de datos cuando ya no son necesarios.",
    weight: 5,
    cid: { c: 2, i: 0, d: 0 },
    questions: [
      "¿Existe un procedimiento formal para la eliminación segura de datos obsoletos en la base de datos?",
    ],
  },
  {
    id: "8.12",
    domain: "tech",
    name: "Prevención de fuga de datos (DLP)",
    goal: "Prevenir extracción no autorizada de datos desde la base de datos.",
    weight: 7,
    cid: { c: 3, i: 0, d: 0 },
    questions: [
      "¿Existen controles técnicos para detectar o prevenir la exportación masiva no autorizada de datos?",
    ],
  },
  {
    id: "8.13",
    domain: "tech",
    name: "Respaldo de la información",
    goal: "Garantizar copias de respaldo periódicas y probadas de la base de datos.",
    weight: 10,
    cid: { c: 0, i: 2, d: 3 },
    questions: [
      "¿Se ejecutan respaldos periódicos de la base de datos conforme a una política definida?",
      "¿Se realizan pruebas de restauración de los respaldos de forma periódica?",
    ],
  },
  {
    id: "8.15",
    domain: "tech",
    name: "Registro de eventos (logging)",
    goal: "Registrar eventos relevantes de seguridad de la base de datos.",
    weight: 8,
    cid: { c: 1, i: 2, d: 1 },
    questions: [
      "¿La base de datos genera bitácoras (logs) de eventos de seguridad y accesos?",
      "¿Los registros de auditoría de la base de datos están protegidos contra modificación o borrado?",
    ],
  },
  {
    id: "8.16",
    domain: "tech",
    name: "Actividades de monitoreo",
    goal: "Monitorear en tiempo real actividad anómala sobre la base de datos.",
    weight: 7,
    cid: { c: 2, i: 2, d: 1 },
    questions: [
      "¿Existe monitoreo activo (alertas) sobre actividad inusual o sospechosa en la base de datos?",
    ],
  },
  {
    id: "8.20",
    domain: "tech",
    name: "Seguridad de redes",
    goal: "Proteger los canales de red por los que se accede a la base de datos.",
    weight: 6,
    cid: { c: 2, i: 1, d: 1 },
    questions: [
      "¿El acceso remoto a la base de datos está segmentado y protegido mediante firewall o VPN?",
    ],
  },
  {
    id: "8.24",
    domain: "tech",
    name: "Uso de criptografía",
    goal: "Cifrar datos sensibles en tránsito y en reposo dentro de la base de datos.",
    weight: 9,
    cid: { c: 3, i: 1, d: 0 },
    questions: [
      "¿Los datos sensibles están cifrados en reposo (encryption at rest)?",
      "¿Las conexiones a la base de datos utilizan cifrado en tránsito (TLS/SSL)?",
    ],
  },
];

/* ============================================================
   ESCALA DE MADUREZ (según especificación del usuario)
   ============================================================ */
const MATURITY_SCALE = [
  { level: 0, label: "Inexistente", desc: "El control no existe y no hay evidencia de implementación." },
  { level: 1, label: "Inicial / Informal", desc: "Existe de manera informal o se aplica ocasionalmente sin procedimiento." },
  { level: 2, label: "Repetible / Parcial", desc: "Se aplica parcialmente con prácticas documentadas pero inconsistentes." },
  { level: 3, label: "Definido", desc: "Documentado, definido e implementado en la mayoría de los procesos." },
  { level: 4, label: "Gestionado", desc: "Completamente implementado, con evidencias y supervisión periódica." },
  { level: 5, label: "Optimizado", desc: "Medido, evaluado continuamente y parte de un proceso de mejora continua." },
];

/* ============================================================
   DATOS DE DEMO (para poblar el dashboard)
   ============================================================ */
const DEMO_AUDITS = [
  { id: "a1", org: "Cooperativa AgroSur R.L.", area: "Sistemas de Información", auditor: "M. Vargas", dba: "J. Solano", date: "2026-06-14", status: "Completada", score: 62 },
  { id: "a2", org: "Clínica Bienestar Total", area: "TI / Expedientes", auditor: "R. Jiménez", dba: "P. Castro", date: "2026-07-02", status: "Completada", score: 41 },
  { id: "a3", org: "Municipalidad de Ceiba Alta", area: "Plataforma de Servicios", auditor: "M. Vargas", dba: "L. Rojas", date: "2026-07-28", status: "En progreso", score: null },
];

/* ============================================================
   HELPERS DE CÁLCULO
   ============================================================ */

// Nivel de cumplimiento de un control a partir de respuestas Sí/No/NA
function complianceForControl(control, answers) {
  const relevant = control.questions
    .map((_, qi) => answers?.[`${control.id}-${qi}`]?.value)
    .filter((v) => v && v !== "na");
  if (relevant.length === 0) return null; // todas NA
  const yes = relevant.filter((v) => v === "yes").length;
  return yes / relevant.length; // 0..1
}

// Exposición al riesgo de un control para una dimensión (C, I o D)
// Riesgo = Peso * (5 - Madurez)/5 * relevancia_dimensión(0-3)/3
function riskForControl(control, maturity, dim) {
  const rel = control.cid[dim]; // 0..3
  if (rel === 0) return 0;
  const gap = (5 - maturity) / 5; // 0 (óptimo) .. 1 (inexistente)
  return control.weight * gap * (rel / 3);
}

function maturityColor(level) {
  if (level === null || level === undefined) return "#3A4552";
  if (level <= 1) return "#E5484D";
  if (level <= 2) return "#F5A623";
  if (level <= 3) return "#E8D44D";
  return "#3DDC84";
}

function riskColor(score) {
  // score esperado 0-10 aprox (normalizado luego)
  if (score >= 66) return "#E5484D";
  if (score >= 33) return "#F5A623";
  return "#3DDC84";
}

/* ============================================================
   COMPONENTE PRINCIPAL
   ============================================================ */

export default function App() {
  const [view, setView] = useState("dashboard"); // dashboard | wizard | results
  const [audits, setAudits] = useState(DEMO_AUDITS);
  const [currentMeta, setCurrentMeta] = useState({ org: "", area: "", auditor: "", dba: "", date: "" });
  const [step, setStep] = useState(0); // índice de control actual en el wizard
  const [answers, setAnswers] = useState({}); // { "controlId-qIndex": {value, comment} }
  const [maturity, setMaturity] = useState({}); // { controlId: level }
  const [lastResult, setLastResult] = useState(null);

  const control = CONTROLS[step];
  const totalSteps = CONTROLS.length;

  function startNewAudit() {
    setCurrentMeta({ org: "", area: "", auditor: "", dba: "", date: "" });
    setAnswers({});
    setMaturity({});
    setStep(0);
    setView("meta");
  }

  function beginQuestionnaire() {
    setView("wizard");
  }

  function setAnswer(controlId, qi, field, value) {
    const key = `${controlId}-${qi}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  }

  function setControlMaturity(controlId, level) {
    setMaturity((prev) => ({ ...prev, [controlId]: level }));
  }

  function controlIsAnswered(c) {
    const qsOk = c.questions.every((_, qi) => answers[`${c.id}-${qi}`]?.value);
    const mOk = maturity[c.id] !== undefined;
    return qsOk && mOk;
  }

  function finishAudit() {
    const result = computeResults(currentMeta, answers, maturity);
    setLastResult(result);
    setAudits((prev) => [
      {
        id: "a" + (prev.length + 1),
        org: currentMeta.org || "Organización sin nombre",
        area: currentMeta.area || "—",
        auditor: currentMeta.auditor || "—",
        dba: currentMeta.dba || "—",
        date: currentMeta.date || new Date().toISOString().slice(0, 10),
        status: "Completada",
        score: result.riskIndex,
      },
      ...prev,
    ]);
    setView("results");
  }

  return (
    <div style={styles.app}>
      <Sidebar view={view} onNav={(v) => { if (v === "dashboard") setView("dashboard"); }} />
      <div style={styles.main}>
        {view === "dashboard" && (
          <Dashboard audits={audits} onNewAudit={startNewAudit} onOpenResult={() => lastResult && setView("results")} hasResult={!!lastResult} />
        )}
        {view === "meta" && (
          <MetaForm meta={currentMeta} setMeta={setCurrentMeta} onContinue={beginQuestionnaire} onCancel={() => setView("dashboard")} />
        )}
        {view === "wizard" && control && (
          <Wizard
            control={control}
            step={step}
            totalSteps={totalSteps}
            answers={answers}
            maturity={maturity[control.id]}
            setAnswer={setAnswer}
            setControlMaturity={setControlMaturity}
            controlIsAnswered={controlIsAnswered}
            allControls={CONTROLS}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
            onNext={() => {
              if (step < totalSteps - 1) setStep((s) => s + 1);
              else finishAudit();
            }}
            onJump={(i) => setStep(i)}
            onExit={() => setView("dashboard")}
          />
        )}
        {view === "results" && lastResult && (
          <Results result={lastResult} meta={currentMeta} onBack={() => setView("dashboard")} onNewAudit={startNewAudit} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CÁLCULO DE RESULTADOS FINALES
   ============================================================ */
function computeResults(meta, answers, maturity) {
  const perControl = CONTROLS.map((c) => {
    const compliance = complianceForControl(c, answers); // 0..1 or null
    const mLevel = maturity[c.id] ?? 0;
    const risk = {
      c: riskForControl(c, mLevel, "c"),
      i: riskForControl(c, mLevel, "i"),
      d: riskForControl(c, mLevel, "d"),
    };
    const maxPossible = c.weight * ((c.cid.c + c.cid.i + c.cid.d) / 3) * 3; // aprox techo teórico *3 dims
    return { control: c, compliance, maturity: mLevel, risk };
  });

  // Normalización de riesgo por dimensión a escala 0-100
  const totalWeightC = CONTROLS.reduce((s, c) => s + c.weight * (c.cid.c / 3), 0);
  const totalWeightI = CONTROLS.reduce((s, c) => s + c.weight * (c.cid.i / 3), 0);
  const totalWeightD = CONTROLS.reduce((s, c) => s + c.weight * (c.cid.d / 3), 0);

  const rawC = perControl.reduce((s, p) => s + p.risk.c, 0);
  const rawI = perControl.reduce((s, p) => s + p.risk.i, 0);
  const rawD = perControl.reduce((s, p) => s + p.risk.d, 0);

  const riskC = totalWeightC ? Math.round((rawC / totalWeightC) * 100) : 0;
  const riskI = totalWeightI ? Math.round((rawI / totalWeightI) * 100) : 0;
  const riskD = totalWeightD ? Math.round((rawD / totalWeightD) * 100) : 0;

  const riskIndex = Math.round((riskC + riskI + riskD) / 3);

  // Cumplimiento por dominio
  const byDomain = DOMAINS.map((d) => {
    const ctrls = perControl.filter((p) => p.control.domain === d.id);
    const avgMaturity = ctrls.reduce((s, p) => s + p.maturity, 0) / (ctrls.length || 1);
    const compliances = ctrls.map((p) => p.compliance).filter((v) => v !== null);
    const avgCompliance = compliances.length ? compliances.reduce((s, v) => s + v, 0) / compliances.length : 0;
    return { domain: d, avgMaturity, avgCompliance, count: ctrls.length };
  });

  const sortedByMaturity = [...perControl].sort((a, b) => a.maturity - b.maturity);
  const lowestMaturity = sortedByMaturity.slice(0, 5);

  const totalRiskPerControl = perControl.map((p) => ({
    ...p,
    totalRisk: p.risk.c + p.risk.i + p.risk.d,
  }));
  const highestRisk = [...totalRiskPerControl].sort((a, b) => b.totalRisk - a.totalRisk).slice(0, 5);

  const overallCompliance = Math.round(
    (perControl.reduce((s, p) => s + (p.compliance ?? 0), 0) / perControl.length) * 100
  );
  const overallMaturity = perControl.reduce((s, p) => s + p.maturity, 0) / perControl.length;

  return {
    meta,
    perControl,
    byDomain,
    riskC,
    riskI,
    riskD,
    riskIndex,
    lowestMaturity,
    highestRisk,
    overallCompliance,
    overallMaturity,
  };
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar({ view, onNav }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandMark}>◈</div>
        <div>
          <div style={styles.brandName}>RISKBASE</div>
          <div style={styles.brandSub}>Auditoría ISO/IEC 27002 · BD</div>
        </div>
      </div>
      <nav style={styles.nav}>
        <button
          onClick={() => onNav("dashboard")}
          style={{ ...styles.navItem, ...(view === "dashboard" || view === "meta" ? styles.navItemActive : {}) }}
        >
          <span style={styles.navDot} />
          Panel general
        </button>
        <button
          style={{ ...styles.navItem, ...(view === "wizard" ? styles.navItemActive : {}) }}
          disabled
        >
          <span style={styles.navDot} />
          Cuestionario en curso
        </button>
        <button
          style={{ ...styles.navItem, ...(view === "results" ? styles.navItemActive : {}) }}
          disabled
        >
          <span style={styles.navDot} />
          Resultados
        </button>
      </nav>
      <div style={styles.sidebarFooter}>
        <div style={styles.legendTitle}>Escala de riesgo</div>
        <LegendRow color="#3DDC84" label="Bajo" />
        <LegendRow color="#F5A623" label="Medio" />
        <LegendRow color="#E5484D" label="Alto" />
      </div>
    </div>
  );
}

function LegendRow({ color, label }) {
  return (
    <div style={styles.legendRow}>
      <span style={{ ...styles.legendSwatch, background: color }} />
      <span style={styles.legendLabel}>{label}</span>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function Dashboard({ audits, onNewAudit, onOpenResult, hasResult }) {
  const completed = audits.filter((a) => a.status === "Completada");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, a) => s + (a.score || 0), 0) / completed.length)
    : 0;

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.eyebrow}>Panel general</div>
          <h1 style={styles.h1}>Exposición al riesgo en Administración de Bases de Datos</h1>
        </div>
        <button style={styles.primaryBtn} onClick={onNewAudit}>
          + Nueva auditoría
        </button>
      </div>

      <div style={styles.kpiRow}>
        <KpiCard label="Auditorías registradas" value={audits.length} />
        <KpiCard label="Completadas" value={completed.length} />
        <KpiCard
          label="Índice de riesgo promedio"
          value={avgScore + "%"}
          accent={riskColor(avgScore)}
        />
        {hasResult && (
          <button style={styles.kpiActionCard} onClick={onOpenResult}>
            <div style={styles.kpiActionLabel}>Última auditoría</div>
            <div style={styles.kpiActionValue}>Ver resultados →</div>
          </button>
        )}
      </div>

      <div style={styles.sectionTitle}>Historial de auditorías</div>
      <div style={styles.table}>
        <div style={styles.tableHeadRow}>
          <span style={{ flex: 2 }}>Organización</span>
          <span style={{ flex: 1.4 }}>Área evaluada</span>
          <span style={{ flex: 1.2 }}>Auditor</span>
          <span style={{ flex: 1.2 }}>DBA</span>
          <span style={{ flex: 1 }}>Fecha</span>
          <span style={{ flex: 1 }}>Estado</span>
          <span style={{ flex: 1, textAlign: "right" }}>Riesgo</span>
        </div>
        {audits.map((a) => (
          <div key={a.id} style={styles.tableRow}>
            <span style={{ flex: 2, fontWeight: 600 }}>{a.org}</span>
            <span style={{ flex: 1.4, color: "#8A97A6" }}>{a.area}</span>
            <span style={{ flex: 1.2, color: "#8A97A6" }}>{a.auditor}</span>
            <span style={{ flex: 1.2, color: "#8A97A6" }}>{a.dba}</span>
            <span style={{ flex: 1, color: "#8A97A6" }}>{a.date}</span>
            <span style={{ flex: 1 }}>
              <span
                style={{
                  ...styles.statusPill,
                  ...(a.status === "Completada"
                    ? { background: "#123321", color: "#3DDC84" }
                    : { background: "#2A2410", color: "#F5A623" }),
                }}
              >
                {a.status}
              </span>
            </span>
            <span style={{ flex: 1, textAlign: "right" }}>
              {a.score !== null ? (
                <span style={{ color: riskColor(a.score), fontWeight: 700, fontFamily: "var(--mono)" }}>
                  {a.score}%
                </span>
              ) : (
                <span style={{ color: "#4A5563" }}>—</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value, accent }) {
  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={{ ...styles.kpiValue, color: accent || "#E8EDF2" }}>{value}</div>
    </div>
  );
}

/* ============================================================
   FORMULARIO DE METADATOS DE LA AUDITORÍA
   ============================================================ */
function MetaForm({ meta, setMeta, onContinue, onCancel }) {
  const canContinue = meta.org.trim().length > 0;
  return (
    <div style={styles.page}>
      <div style={styles.eyebrow}>Nueva auditoría</div>
      <h1 style={styles.h1}>Datos generales</h1>
      <p style={styles.subtitle}>
        Registra el contexto de la auditoría antes de iniciar el cuestionario de {CONTROLS.length} controles.
      </p>

      <div style={styles.formGrid}>
        <Field label="Organización *" value={meta.org} onChange={(v) => setMeta({ ...meta, org: v })} placeholder="Ej. Cooperativa AgroSur R.L." />
        <Field label="Área evaluada" value={meta.area} onChange={(v) => setMeta({ ...meta, area: v })} placeholder="Ej. Sistemas de Información" />
        <Field label="Auditor" value={meta.auditor} onChange={(v) => setMeta({ ...meta, auditor: v })} placeholder="Nombre del auditor" />
        <Field label="Administrador de Bases de Datos" value={meta.dba} onChange={(v) => setMeta({ ...meta, dba: v })} placeholder="Nombre del DBA" />
        <Field label="Fecha" value={meta.date} onChange={(v) => setMeta({ ...meta, date: v })} placeholder="AAAA-MM-DD" type="date" />
      </div>

      <div style={styles.formActions}>
        <button style={styles.ghostBtn} onClick={onCancel}>Cancelar</button>
        <button
          style={{ ...styles.primaryBtn, ...(canContinue ? {} : styles.disabledBtn) }}
          disabled={!canContinue}
          onClick={onContinue}
        >
          Iniciar cuestionario →
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <input
        style={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/* ============================================================
   WIZARD DE CUESTIONARIO
   ============================================================ */
function Wizard({
  control,
  step,
  totalSteps,
  answers,
  maturity,
  setAnswer,
  setControlMaturity,
  controlIsAnswered,
  allControls,
  onPrev,
  onNext,
  onJump,
  onExit,
}) {
  const domain = DOMAINS.find((d) => d.id === control.domain);
  const canAdvance = controlIsAnswered(control);
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.wizardTopBar}>
        <button style={styles.linkBtn} onClick={onExit}>← Salir sin guardar</button>
        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <span style={styles.progressLabel}>
            Control {step + 1} de {totalSteps}
          </span>
        </div>
      </div>

      <div style={styles.stepDots}>
        {allControls.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onJump(i)}
            title={c.id + " · " + c.name}
            style={{
              ...styles.stepDot,
              background: i === step ? DOMAINS.find((d) => d.id === c.domain).color : "#232C36",
              opacity: i === step ? 1 : controlIsAnswered(c) ? 0.85 : 0.35,
            }}
          />
        ))}
      </div>

      <div style={styles.controlCard}>
        <div style={{ ...styles.domainTag, background: domain.color + "22", color: domain.color }}>
          {domain.name} · {control.id}
        </div>
        <h2 style={styles.controlName}>{control.name}</h2>
        <p style={styles.controlGoal}>{control.goal}</p>

        <div style={styles.questionsBlock}>
          {control.questions.map((q, qi) => {
            const key = `${control.id}-${qi}`;
            const current = answers[key] || {};
            return (
              <div key={key} style={styles.questionRow}>
                <div style={styles.questionText}>{qi + 1}. {q}</div>
                <div style={styles.answerOptions}>
                  {[
                    { v: "yes", label: "Sí" },
                    { v: "no", label: "No" },
                    { v: "na", label: "No aplica" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setAnswer(control.id, qi, "value", opt.v)}
                      style={{
                        ...styles.answerBtn,
                        ...(current.value === opt.v ? answerActiveStyle(opt.v) : {}),
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <textarea
                  style={styles.commentBox}
                  placeholder={current.value === "na" ? "Justifique por qué no aplica…" : "Observaciones / evidencia encontrada (opcional)…"}
                  value={current.comment || ""}
                  onChange={(e) => setAnswer(control.id, qi, "comment", e.target.value)}
                  rows={2}
                />
              </div>
            );
          })}
        </div>

        <div style={styles.maturityBlock}>
          <div style={styles.maturityTitle}>Nivel de madurez observado</div>
          <div style={styles.maturityOptions}>
            {MATURITY_SCALE.map((m) => (
              <button
                key={m.level}
                onClick={() => setControlMaturity(control.id, m.level)}
                title={m.desc}
                style={{
                  ...styles.maturityBtn,
                  ...(maturity === m.level
                    ? { background: maturityColor(m.level), color: "#0B0F14", borderColor: maturityColor(m.level) }
                    : {}),
                }}
              >
                <span style={styles.maturityLevelNum}>{m.level}</span>
                <span style={styles.maturityLevelLabel}>{m.label}</span>
              </button>
            ))}
          </div>
          {maturity !== undefined && (
            <div style={styles.maturityDesc}>{MATURITY_SCALE[maturity].desc}</div>
          )}
        </div>
      </div>

      <div style={styles.wizardActions}>
        <button style={styles.ghostBtn} onClick={onPrev} disabled={step === 0}>
          ← Anterior
        </button>
        <button
          style={{ ...styles.primaryBtn, ...(canAdvance ? {} : styles.disabledBtn) }}
          disabled={!canAdvance}
          onClick={onNext}
        >
          {step === totalSteps - 1 ? "Finalizar auditoría →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}

function answerActiveStyle(v) {
  if (v === "yes") return { background: "#123321", borderColor: "#3DDC84", color: "#3DDC84" };
  if (v === "no") return { background: "#331414", borderColor: "#E5484D", color: "#E5484D" };
  return { background: "#232C36", borderColor: "#8A97A6", color: "#C7D0DA" };
}

/* ============================================================
   RESULTADOS
   ============================================================ */
function Results({ result, meta, onBack, onNewAudit }) {
  const { riskC, riskI, riskD, riskIndex, byDomain, lowestMaturity, highestRisk, overallCompliance, overallMaturity } = result;

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.eyebrow}>Reporte ejecutivo</div>
          <h1 style={styles.h1}>{meta.org || "Auditoría"} — Resultados</h1>
          <p style={styles.subtitle}>
            {meta.area || "Área no especificada"} · Auditor: {meta.auditor || "—"} · DBA: {meta.dba || "—"} · {meta.date || "—"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={styles.ghostBtn} onClick={onBack}>← Panel general</button>
          <button style={styles.primaryBtn} onClick={onNewAudit}>+ Nueva auditoría</button>
        </div>
      </div>

      {/* Semáforo general */}
      <div style={styles.semaphoreRow}>
        <SemaphoreCard label="Confidencialidad" value={riskC} />
        <SemaphoreCard label="Integridad" value={riskI} />
        <SemaphoreCard label="Disponibilidad" value={riskD} />
        <div style={styles.indexCard}>
          <div style={styles.indexLabel}>Índice general de exposición al riesgo</div>
          <div style={{ ...styles.indexValue, color: riskColor(riskIndex) }}>{riskIndex}%</div>
          <div style={styles.indexBarTrack}>
            <div style={{ ...styles.indexBarFill, width: `${riskIndex}%`, background: riskColor(riskIndex) }} />
          </div>
          <div style={styles.indexSub}>
            Cumplimiento global: <b style={{ color: "#E8EDF2" }}>{overallCompliance}%</b> · Madurez promedio:{" "}
            <b style={{ color: "#E8EDF2" }}>{overallMaturity.toFixed(1)} / 5</b>
          </div>
        </div>
      </div>

      {/* Cumplimiento y madurez por dominio */}
      <div style={styles.sectionTitle}>Resultados por dominio</div>
      <div style={styles.domainGrid}>
        {byDomain.map((d) => (
          <div key={d.domain.id} style={styles.domainCard}>
            <div style={{ ...styles.domainCardTag, color: d.domain.color }}>{d.domain.name}</div>
            <div style={styles.domainMetricRow}>
              <span style={styles.domainMetricLabel}>Madurez prom.</span>
              <div style={styles.miniBarTrack}>
                <div
                  style={{
                    ...styles.miniBarFill,
                    width: `${(d.avgMaturity / 5) * 100}%`,
                    background: maturityColor(Math.round(d.avgMaturity)),
                  }}
                />
              </div>
              <span style={styles.domainMetricValue}>{d.avgMaturity.toFixed(1)}/5</span>
            </div>
            <div style={styles.domainMetricRow}>
              <span style={styles.domainMetricLabel}>Cumplimiento</span>
              <div style={styles.miniBarTrack}>
                <div style={{ ...styles.miniBarFill, width: `${d.avgCompliance * 100}%`, background: "#5B8DEF" }} />
              </div>
              <span style={styles.domainMetricValue}>{Math.round(d.avgCompliance * 100)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mapa de calor */}
      <div style={styles.sectionTitle}>Mapa de calor — madurez por control</div>
      <HeatMap perControl={result.perControl} />

      {/* Rankings */}
      <div style={styles.rankGrid}>
        <RankPanel
          title="Controles con menor nivel de madurez"
          items={lowestMaturity.map((p) => ({
            id: p.control.id,
            name: p.control.name,
            valueLabel: `${p.maturity}/5`,
            color: maturityColor(p.maturity),
          }))}
        />
        <RankPanel
          title="Controles con mayor exposición al riesgo"
          items={highestRisk.map((p) => ({
            id: p.control.id,
            name: p.control.name,
            valueLabel: `${Math.round(p.totalRisk)} pts`,
            color: riskColor(Math.min(100, p.totalRisk * 3)),
          }))}
        />
      </div>
    </div>
  );
}

function SemaphoreCard({ label, value }) {
  const color = riskColor(value);
  return (
    <div style={styles.semaphoreCard}>
      <div style={styles.semaphoreLights}>
        <span style={{ ...styles.light, opacity: color === "#E5484D" ? 1 : 0.15, background: "#E5484D" }} />
        <span style={{ ...styles.light, opacity: color === "#F5A623" ? 1 : 0.15, background: "#F5A623" }} />
        <span style={{ ...styles.light, opacity: color === "#3DDC84" ? 1 : 0.15, background: "#3DDC84" }} />
      </div>
      <div style={styles.semaphoreLabel}>{label}</div>
      <div style={{ ...styles.semaphoreValue, color }}>{value}%</div>
    </div>
  );
}

function HeatMap({ perControl }) {
  return (
    <div style={styles.heatGrid}>
      {perControl.map((p) => (
        <div
          key={p.control.id}
          title={`${p.control.id} · ${p.control.name}\nMadurez: ${p.maturity}/5`}
          style={{ ...styles.heatCell, background: maturityColor(p.maturity) }}
        >
          <span style={styles.heatCellId}>{p.control.id}</span>
        </div>
      ))}
    </div>
  );
}

function RankPanel({ title, items }) {
  return (
    <div style={styles.rankPanel}>
      <div style={styles.rankPanelTitle}>{title}</div>
      {items.map((it, i) => (
        <div key={it.id} style={styles.rankRow}>
          <span style={styles.rankNum}>{i + 1}</span>
          <span style={styles.rankId}>{it.id}</span>
          <span style={styles.rankName}>{it.name}</span>
          <span style={{ ...styles.rankValue, color: it.color }}>{it.valueLabel}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   ESTILOS
   ============================================================ */
const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#0B0F14",
    color: "#E8EDF2",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  sidebar: {
    width: 240,
    minWidth: 240,
    borderRight: "1px solid #1B242E",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: {
    width: 34, height: 34, borderRadius: 8,
    background: "linear-gradient(135deg, #5B8DEF, #3DDC84)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, color: "#0B0F14", fontWeight: 900,
  },
  brandName: { fontWeight: 800, letterSpacing: 1, fontSize: 14 },
  brandSub: { fontSize: 11, color: "#6B7684", marginTop: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px", borderRadius: 8, border: "none",
    background: "transparent", color: "#8A97A6", fontSize: 13.5,
    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
  },
  navItemActive: { background: "#141B22", color: "#E8EDF2" },
  navDot: { width: 6, height: 6, borderRadius: 999, background: "#3A4552" },
  sidebarFooter: { marginTop: "auto", paddingTop: 20, borderTop: "1px solid #1B242E" },
  legendTitle: { fontSize: 11, color: "#6B7684", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },
  legendRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  legendSwatch: { width: 10, height: 10, borderRadius: 3 },
  legendLabel: { fontSize: 12.5, color: "#8A97A6" },

  main: { flex: 1, overflowY: "auto" },
  page: { maxWidth: 1080, margin: "0 auto", padding: "36px 40px 80px" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16, flexWrap: "wrap" },
  eyebrow: { fontSize: 11.5, letterSpacing: 1.2, textTransform: "uppercase", color: "#5B8DEF", fontWeight: 700, marginBottom: 6 },
  h1: { fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.4, lineHeight: 1.25 },
  subtitle: { color: "#8A97A6", fontSize: 14, marginTop: 8, maxWidth: 640 },

  primaryBtn: {
    background: "#5B8DEF", color: "#0B0F14", border: "none", borderRadius: 8,
    padding: "11px 18px", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  ghostBtn: {
    background: "transparent", color: "#C7D0DA", border: "1px solid #29333F", borderRadius: 8,
    padding: "11px 18px", fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
  },
  linkBtn: {
    background: "transparent", color: "#8A97A6", border: "none", fontSize: 13, cursor: "pointer", fontFamily: "inherit", padding: 0,
  },
  disabledBtn: { opacity: 0.35, cursor: "not-allowed" },

  kpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 36 },
  kpiCard: { background: "#141B22", border: "1px solid #1B242E", borderRadius: 12, padding: "18px 20px" },
  kpiLabel: { fontSize: 12, color: "#8A97A6", marginBottom: 8 },
  kpiValue: { fontSize: 28, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
  kpiActionCard: {
    background: "linear-gradient(135deg, #16233A, #141B22)", border: "1px solid #2A3D5C", borderRadius: 12,
    padding: "18px 20px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
  },
  kpiActionLabel: { fontSize: 12, color: "#8A97A6", marginBottom: 8 },
  kpiActionValue: { fontSize: 15, fontWeight: 700, color: "#5B8DEF" },

  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#C7D0DA", textTransform: "uppercase", letterSpacing: 0.6, margin: "8px 0 14px" },
  table: { border: "1px solid #1B242E", borderRadius: 12, overflow: "hidden" },
  tableHeadRow: {
    display: "flex", padding: "12px 18px", background: "#101720", fontSize: 11.5,
    color: "#6B7684", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700,
  },
  tableRow: {
    display: "flex", padding: "16px 18px", borderTop: "1px solid #1B242E", fontSize: 13.5, alignItems: "center",
  },
  statusPill: { fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 },

  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 640, marginTop: 8 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: { fontSize: 12.5, color: "#8A97A6", fontWeight: 600 },
  input: {
    background: "#141B22", border: "1px solid #29333F", borderRadius: 8, padding: "11px 12px",
    color: "#E8EDF2", fontSize: 14, fontFamily: "inherit", outline: "none",
  },
  formActions: { display: "flex", gap: 10, marginTop: 32 },

  wizardTopBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 20 },
  progressWrap: { display: "flex", alignItems: "center", gap: 12, flex: 1, maxWidth: 420, marginLeft: "auto" },
  progressTrack: { flex: 1, height: 6, background: "#1B242E", borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#5B8DEF,#3DDC84)", borderRadius: 999, transition: "width .25s ease" },
  progressLabel: { fontSize: 12, color: "#8A97A6", whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace" },

  stepDots: { display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20 },
  stepDot: { width: 16, height: 6, borderRadius: 3, border: "none", cursor: "pointer", padding: 0 },

  controlCard: { background: "#141B22", border: "1px solid #1B242E", borderRadius: 16, padding: "28px 30px" },
  domainTag: { display: "inline-block", fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" },
  controlName: { fontSize: 21, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.3 },
  controlGoal: { color: "#8A97A6", fontSize: 14, lineHeight: 1.5, marginBottom: 24 },

  questionsBlock: { display: "flex", flexDirection: "column", gap: 20 },
  questionRow: { borderTop: "1px solid #1B242E", paddingTop: 18 },
  questionText: { fontSize: 14.5, fontWeight: 600, marginBottom: 12, lineHeight: 1.4 },
  answerOptions: { display: "flex", gap: 8, marginBottom: 10 },
  answerBtn: {
    background: "#0E141B", border: "1px solid #29333F", color: "#8A97A6", borderRadius: 8,
    padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },
  commentBox: {
    width: "100%", background: "#0E141B", border: "1px solid #232C36", borderRadius: 8,
    padding: "9px 11px", color: "#C7D0DA", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box",
  },

  maturityBlock: { marginTop: 26, paddingTop: 22, borderTop: "1px solid #1B242E" },
  maturityTitle: { fontSize: 13, fontWeight: 700, color: "#C7D0DA", marginBottom: 12 },
  maturityOptions: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 },
  maturityBtn: {
    background: "#0E141B", border: "1px solid #29333F", borderRadius: 10, padding: "10px 6px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontFamily: "inherit",
  },
  maturityLevelNum: { fontSize: 17, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
  maturityLevelLabel: { fontSize: 9.5, textAlign: "center", lineHeight: 1.2, color: "inherit" },
  maturityDesc: { marginTop: 10, fontSize: 12.5, color: "#8A97A6", fontStyle: "italic" },

  wizardActions: { display: "flex", justifyContent: "space-between", marginTop: 22 },

  semaphoreRow: { display: "grid", gridTemplateColumns: "repeat(3, auto) 1.6fr", gap: 14, marginBottom: 36, alignItems: "stretch" },
  semaphoreCard: {
    background: "#141B22", border: "1px solid #1B242E", borderRadius: 14, padding: "18px 22px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 130,
  },
  semaphoreLights: {
    display: "flex", flexDirection: "column", gap: 5, background: "#0B0F14", padding: "8px 10px", borderRadius: 999, border: "1px solid #1B242E",
  },
  light: { width: 14, height: 14, borderRadius: 999, display: "block" },
  semaphoreLabel: { fontSize: 12, color: "#8A97A6", marginTop: 4 },
  semaphoreValue: { fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
  indexCard: { background: "#141B22", border: "1px solid #1B242E", borderRadius: 14, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 },
  indexLabel: { fontSize: 12.5, color: "#8A97A6", fontWeight: 600 },
  indexValue: { fontSize: 34, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" },
  indexBarTrack: { height: 8, background: "#1B242E", borderRadius: 999, overflow: "hidden" },
  indexBarFill: { height: "100%", borderRadius: 999 },
  indexSub: { fontSize: 12.5, color: "#8A97A6" },

  domainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14, marginBottom: 36 },
  domainCard: { background: "#141B22", border: "1px solid #1B242E", borderRadius: 12, padding: "16px 18px" },
  domainCardTag: { fontSize: 12.5, fontWeight: 800, marginBottom: 12 },
  domainMetricRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  domainMetricLabel: { fontSize: 11, color: "#8A97A6", width: 82, flexShrink: 0 },
  miniBarTrack: { flex: 1, height: 6, background: "#1B242E", borderRadius: 999, overflow: "hidden" },
  miniBarFill: { height: "100%", borderRadius: 999 },
  domainMetricValue: { fontSize: 11.5, color: "#C7D0DA", width: 40, textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },

  heatGrid: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6, marginBottom: 36 },
  heatCell: {
    aspectRatio: "1", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "default",
  },
  heatCellId: { fontSize: 9.5, fontWeight: 800, color: "#0B0F14", fontFamily: "'JetBrains Mono', monospace" },

  rankGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  rankPanel: { background: "#141B22", border: "1px solid #1B242E", borderRadius: 14, padding: "20px 22px" },
  rankPanelTitle: { fontSize: 13, fontWeight: 700, color: "#C7D0DA", marginBottom: 16 },
  rankRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: "1px solid #1B242E" },
  rankNum: { fontSize: 11, color: "#4A5563", width: 16, fontFamily: "'JetBrains Mono', monospace" },
  rankId: { fontSize: 11.5, color: "#5B8DEF", fontFamily: "'JetBrains Mono', monospace", width: 42, flexShrink: 0 },
  rankName: { fontSize: 12.5, color: "#C7D0DA", flex: 1 },
  rankValue: { fontSize: 12.5, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" },
};
