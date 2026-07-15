import React, { useState } from 'react';
import { MODULES } from '../constants';
import ModuleCard from '../components/ModuleCard';

interface HomeProps {
  onModuleClick: (id: string) => void;
  onFullCourseClick: (planId?: string) => void;
  onBookingClick: () => void;
}

type DiagnosticAnswer = boolean | null;

interface DiagnosticItem {
  id: string;
  title: string;
  question: string;
  struggle: string;
  solution: string;
  feedbackYes: string;
  feedbackNo: string;
  icon: string;
}

interface RoiInputs {
  instructors: number;
  courses: number;
  participants: number;
  documentationHours: number;
  frequency: number;
}

const trackConsultiveEvent = (eventName: string, detail?: Record<string, unknown>) => {
  window.dispatchEvent(new CustomEvent(`cademmy:${eventName}`, { detail }));
};

const calculateRoiEstimate = (inputs: RoiInputs) => {
  const methods = Math.max(1, inputs.courses);
  const annualCourseInstances = Math.max(1, inputs.courses * inputs.frequency);
  const potentialFiles = Math.max(1, inputs.participants * annualCourseInstances);
  const instruments = Math.max(1, inputs.courses * 3);
  const rubrics = Math.max(1, inputs.courses * 2);
  const evidenceItems = Math.max(1, potentialFiles * 4);
  const avoidableDocumentationHours = Math.round(inputs.documentationHours * annualCourseInstances * 0.45);

  return {
    methods,
    potentialFiles,
    instruments,
    rubrics,
    evidenceItems,
    avoidableDocumentationHours
  };
};

const getMaturityResult = (answers: DiagnosticAnswer[], items: DiagnosticItem[]) => {
  const answered = answers.filter((answer) => answer !== null).length;
  const risks = answers.filter(Boolean).length;
  const governanceScore = Math.max(0, answered - risks);

  const level =
    governanceScore <= 1
      ? { name: 'Nivel 1: Reactivo', width: '25%', tone: 'bg-brand-red', summary: 'La capacitación depende principalmente de esfuerzos individuales y documentación dispersa.' }
      : governanceScore <= 3
        ? { name: 'Nivel 2: Documentado', width: '50%', tone: 'bg-brand-orange', summary: 'Ya existen prácticas útiles, pero todavía falta estandarización y comparabilidad entre instructores.' }
        : governanceScore <= 5
          ? { name: 'Nivel 3: Estandarizado', width: '75%', tone: 'bg-brand-yellow', summary: 'La organización tiene bases claras para operar con método común y fortalecer trazabilidad.' }
          : { name: 'Nivel 4: Instructor 4.0', width: '100%', tone: 'bg-brand-certification', summary: 'La capacitación puede gestionarse como una operación medible, documentada y escalable.' };

  const strengths = items
    .filter((_, index) => answers[index] === false)
    .map((item) => item.title)
    .slice(0, 3);

  const gaps = items
    .filter((_, index) => answers[index] === true)
    .map((item) => item.title)
    .slice(0, 3);

  return {
    answered,
    risks,
    governanceScore,
    level,
    strengths,
    gaps,
    actions: gaps.length
      ? ['Priorizar brechas con mayor impacto documental.', 'Definir una metodología común de conducción y evaluación.', 'Preparar una cohorte piloto con entregables verificables.']
      : ['Conservar el método actual como línea base.', 'Formalizar indicadores de trazabilidad.', 'Preparar expansión entre áreas o sedes.']
  };
};

const ORG_BENEFITS = [
  {
    icon: '📈',
    title: 'ROI más defendible',
    desc: 'Cada acción de capacitación se conecta con objetivos, instrumentos y evidencias, facilitando explicar al comité qué se midió y con qué criterios.'
  },
  {
    icon: '🗂️',
    title: 'Evidencia disponible',
    desc: 'Cada participante deja evidencia verificable, organizada y lista para revisiones internas, auditorías o decisiones de desarrollo.'
  },
  {
    icon: '🧭',
    title: 'Método común',
    desc: 'La organización deja de depender del estilo individual de cada instructor y habilita una forma consistente de planear, impartir y cerrar sesiones.'
  },
  {
    icon: '🧪',
    title: 'Evaluación comparable',
    desc: 'Rúbricas, listas de cotejo y guías de observación permiten comparar resultados sin depender de evaluaciones subjetivas.'
  },
  {
    icon: '⚙️',
    title: 'Implementación modular',
    desc: 'El sistema se puede iniciar por brechas prioritarias o desplegar como ruta completa, sin convertir la capacitación en una interrupción operativa.'
  },
  {
    icon: '🤖',
    title: 'IA con gobernanza',
    desc: 'La IA acelera planeación y documentación bajo criterios, prompts y lineamientos, reduciendo improvisación y variabilidad en los materiales.'
  }
];

const FAQ_ITEMS = [
  {
    question: "¿Qué es Instructor/Formador 4.0 para empresas?",
    answer: "Es un sistema de estandarización para instructores internos: proporciona una metodología común para planear, impartir y evaluar capacitación, generando instrumentos y evidencias por participante acelerado por herramientas digitales e Inteligencia Artificial."
  },
  {
    question: "¿Es un curso, una metodología o una plataforma?",
    answer: "Es una metodología de gobernanza de capacitación implementada mediante talleres, microcursos, instrumentos y herramientas digitales. No sustituye tu LMS ni tus procesos internos; los complementa con método común, evidencia y criterios de evaluación."
  },
  {
    question: "¿Cómo justifico la inversión ante un comité?",
    answer: "La conversación se plantea desde brechas de negocio: variabilidad entre instructores, trazabilidad, evidencia, evaluación y riesgo documental. En la sesión ejecutiva revisamos alcance, entregables, cohorte, calendario e indicadores que pueden respaldar la propuesta."
  },
  {
    question: "¿Cómo se mide el nivel de madurez?",
    answer: "La página usa un diagnóstico orientativo de 7 riesgos. El nivel se calcula con una lógica simple: mientras menos riesgos activos existan, mayor madurez de gobernanza. No sustituye una auditoría ni una consultoría formal; ayuda a preparar la conversación ejecutiva."
  },
  {
    question: "¿Sustituye nuestro LMS actual?",
    answer: "No. Instructor 4.0 puede convivir con un LMS existente porque se enfoca en método, instrumentos, evidencia y competencias del instructor. El LMS puede seguir funcionando como repositorio o canal de distribución."
  },
  {
    question: "¿Qué significa IA con gobernanza?",
    answer: "Significa usar IA con lineamientos, prompts, criterios de revisión y control humano. La IA acelera planeación y documentación, pero las decisiones metodológicas y la validación final permanecen en manos del equipo responsable."
  },
  {
    question: "¿Existe alguna promoción de certificación para mi grupo?",
    answer: "Sí. Si tu grupo o generación se inscribe a la Ruta Completa (los 7 microcursos), se bonifica al 100% el costo de alineación del estándar. La evaluación formal y la emisión del certificado CONOCER son procesos independientes; el certificado se paga únicamente cuando el candidato realiza su evaluación y resulta dictaminado como 'Competente'."
  },
  {
    question: "¿A quién va dirigido dentro de la empresa?",
    answer: "Está dirigido de manera prioritaria a Direcciones de Recursos Humanos, L&D (Alineación y Desarrollo), universidades corporativas y líderes responsables de capacitación interna. Al mismo tiempo, es ideal para expertos técnicos e ingenieros de planta que hoy capacitan por experiencia pero no cuentan con un método andragógico estandarizado."
  },
  {
    question: "¿Esto es un curso o un programa completo?",
    answer: "Es un programa modular sumamente ágil: puedes adquirir el acceso a microcursos específicos para atender brechas de diagnóstico inmediatas o bien implementar la ruta completa para obtener una estandarización institucional total en tu organización."
  },
  {
    question: "¿La IA reemplaza al instructor?",
    answer: "En absoluto. La Inteligencia Artificial actúa como un copiloto de alto rendimiento para acelerar tareas repetitivas bajo criterios de calidad (como redacción de planeaciones didácticas, plantillas y diseño de instrumentos de evaluación). El instructor humano mantiene en todo momento el control metodológico y la toma de decisiones finales."
  },
  {
    question: "¿Necesitamos saber de Inteligencia Artificial para tomar el programa?",
    answer: "No, para nada. El entrenamiento parte desde cero e incluye flujos altamente guiados, plantillas preconfiguradas y esquemas sencillos para que cualquier persona del equipo use la IA de forma segura, estructurada y muy consistente sin requerir conocimientos técnicos previos."
  },
  {
    question: "¿Qué resultados puedo esperar como líder de Recursos Humanos?",
    answer: "• Menos variabilidad metodológica en la impartición de tus instructores de planta.\n• Expedientes de evidencia defendibles (instrumentos + portafolio por participante).\n• Mayor trazabilidad sobre la asimilación del aprendizaje.\n• Una base más clara de reportabilidad para tus juntas de comité o auditorías regulatorias."
  },
  {
    question: "¿Qué entregables físicos/digitales recibe la organización?",
    answer: "Se generan de forma inmediata los instrumentos clave de evaluación (rúbricas analíticas, listas de cotejo, guías de observación), la planeación o carta didáctica detallada, la estructura digitalizada del portafolio del grupo y lineamientos institucionales listos para replicar el método al interior del negocio (dependiendo del plan contratado)."
  },
  {
    question: "¿Se puede adaptar a mi sector específico (planta, operación, retail o servicios)?",
    answer: "Sí, por supuesto. Todos los ejemplos prácticos, casos de estudio y dinámicas del ecosistema de aprendizaje se adaptan por completo al contexto técnico, operativo o comercial de tu negocio, especialmente bajo nuestros planes in-company."
  },
  {
    question: "¿Este entrenamiento interrumpe la operación diaria de nuestra planta?",
    answer: "Entendemos el costo operativo de frenar líneas de producción o retirar ingenieros clave. Por ello, Instructor 4.0 opera bajo microcursos ágiles que se agendan in-company en horarios flexibles (presencial o híbrido) para reducir la fricción con la operación diaria."
  },
  {
    question: "¿Qué incluye el costo de la Evaluación Formal Extra de $5,000 MXN?",
    answer: "Este costo es aplicable únicamente si el participante requiere evaluarse con fines de acreditación nacional oficial ante el CONOCER en cada una de las competencias individuales e independientes (como EC0217.01 o EC0301). Queremos aclarar que NO es el costo por el portafolio de evidencias interno de los microcursos del programa, los cuales se encuentran completamente cubiertos en tu inversión corporativa sin costo extra."
  },
  {
    question: "¿Cuánto cuesta la emisión oficial del certificado CONOCER?",
    answer: "La emisión del certificado oficial expedido por la SEP-CONOCER tiene un costo de $1,500 MXN. Este cobro se liquida de manera única y exclusivamente cuando el candidato resulta dictaminado como 'Competente' en su juicio de evaluación formal, blindando por completo el presupuesto asignado por tu empresa."
  },
  {
    question: "¿Cuáles son los beneficios corporativos de inscribir a mis instructores a la Ruta Completa?",
    answer: "El beneficio principal es que si inscribes a tus instructores a toda la Ruta Completa, bonificamos al 100% el costo de alineación del estándar. Tu organización solo cubre los procesos oficiales que correspondan para quienes decidan evaluarse formalmente; el certificado se paga únicamente cuando el candidato resulta dictaminado como 'Competente'."
  },
  {
    question: "¿Qué pasa si después queremos certificar formalmente a algunos instructores?",
    answer: "Se puede abrir de forma ágil y transparente la ruta de certificación para aquellos candidatos que cumplan satisfactoriamente con la asimilación del programa y estén listos para el juicio de evaluación formal. Revisamos la elegibilidad de cada uno y diseñamos un calendario de etapas en la sesión inicial."
  },
  {
    question: "¿Cuál es el límite máximo de personas recomendado por grupo?",
    answer: "Para asegurar un acompañamiento andragógico de altísima calidad, dinámicas de co-evaluación fluidas y soporte personalizado para las plantillas de IA, limitamos el tamaño de cada generación a un máximo de 30 personas por grupo o generación in-company."
  },
  {
    question: "¿Nuestros instructores reciben constancias con registro oficial ante la STPS?",
    answer: "Al finalizar y aprobar cada microcurso, se pueden emitir Constancias de Competencias Laborales (Formato DC-3) cuando aplique conforme a los requisitos del servicio contratado. Estas constancias ayudan a documentar los planes de capacitación de tu empresa."
  },
  {
    question: "¿Cuál es el primer paso para cotizar nuestro proyecto?",
    answer: "Agendar una Sesión de Diagnóstico de 15 a 30 minutos sin costo. En ella revisamos a detalle tus objetivos del semestre, tamaño del grupo / generación, brechas de capacitación detectadas y te entregamos una propuesta a la medida (recomendación de módulos, entregables finales y calendario sugerido)."
  },
  {
    question: "¿Qué información debo tener lista para la sesión de diagnóstico?",
    answer: "Te sugerimos tener a la mano el número estimado de participantes, el tipo de instructores que vas a capacitar (expertos puramente técnicos, supervisores o instructores de habilidades blandas), la modalidad que prefieren (presencial, online o híbrida) y si cuentan hoy con requerimientos rígidos de auditorías (ISO, auditorías de clientes, regulaciones STPS o comités internos)."
  },
  {
    question: "¿Cómo se maneja la facturación del servicio?",
    answer: "Se emite factura fiscal correspondiente por cada servicio contratado. Las condiciones específicas de pago se detallan de forma clara y transparente en tu propuesta a la medida. La deducibilidad depende del tratamiento contable y fiscal de cada organización."
  }
];

const Home: React.FC<HomeProps> = ({ onModuleClick, onFullCourseClick, onBookingClick }) => {
  const [activeDiagnosticStep, setActiveDiagnosticStep] = useState<number>(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswer[]>(Array(7).fill(null));
  const [roiInputs, setRoiInputs] = useState<RoiInputs>({
    instructors: 8,
    courses: 12,
    participants: 180,
    documentationHours: 6,
    frequency: 2
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const painPoints: DiagnosticItem[] = [
    {
      id: "roi",
      title: "Impacto y ROI",
      question: "¿Hoy puedes demostrar con evidencia qué cambió después de capacitar?",
      struggle: "Capacitas habilidades blandas o técnicas, pero los resultados no se vuelven observables y comparables. Te cuesta justificar inversión porque falta un sistema de objetivos, instrumentos y evidencias por participante.",
      solution: "Instructor 4.0 conecta objetivos, actividades e instrumentos para generar evidencia por participante y criterios comparables entre grupos. La capacitación deja de ser “solo horas” y se vuelve una mejora verificable.",
      feedbackYes: "Esta brecha suele aparecer cuando la capacitación se gestiona como evento y no como operación medible.",
      feedbackNo: "Buen punto de partida: si ya existe evidencia, el siguiente paso es hacerla comparable y gobernable.",
      icon: "📈"
    },
    {
      id: "evidencia",
      title: "Auditoría y Evidencias",
      question: "¿Tu evidencia principal sigue siendo asistencia y encuestas de satisfacción?",
      struggle: "Solo tienes carpetas de hojas firmadas como listas de asistencia y encuestas superficiales de satisfacción (las cuales no prueban aprendizaje). Ante auditorías de calidad o sistemas de gestión interna, la capacitación es difícil de sustentar técnicamente.",
      solution: "Creamos portafolios de evidencias digitales de cada participante, listos en segundos. Esto te otorga un expediente transparente con listas de cotejo, resultados ponderados, firmas de acuerdos y rúbricas analíticas estructuradas.",
      feedbackYes: "Aquí existe una oportunidad clara: transformar registros administrativos en evidencia de aprendizaje.",
      feedbackNo: "Eso indica una base documental valiosa. Conviene revisar si es consistente entre áreas e instructores.",
      icon: "📊"
    },
    {
      id: "estandar",
      title: "Estandarización",
      question: "¿Cada instructor interno imparte con un estilo y criterio diferente?",
      struggle: "Tu capacitación interna es inconsistente. Dependes de un 'instructor estrella' empírico; si esa persona se va o es promovida, todo el know-how metodológico de impartición técnica se pierde o se diluye, creando silos de información.",
      solution: "Institucionaliza un protocolo oficial corporativo uniforme de encuadre, conducción participativa, cierre, medición de conocimientos y archivo documental, de tal modo que cualquier experto técnico pueda dar clases con el mismo estándar de calidad.",
      feedbackYes: "La variabilidad no siempre se ve como riesgo hasta que se intenta escalar o auditar la capacitación.",
      feedbackNo: "Si ya existe consistencia, el sistema puede ayudar a documentarla y volverla replicable.",
      icon: "🧬"
    },
    {
      id: "evaluacion",
      title: "Evaluación Científica",
      question: "¿Los aprendizajes se evalúan más por criterio personal que por instrumentos compartidos?",
      struggle: "No existen rúbricas ni criterios formales de calificación; la asimilación del staff se evalúa 'a ojo' u ojeando un cuestionario de memoria superficial, lo cual no comprueba destrezas de desempeño práctico en su área operativa diaria.",
      solution: "Enseñamos a tus instructores a formular e implementar Guías de Observación de comportamientos de seguridad, Listas de Cotejo de entregables físicos corporativos y Rúbricas analíticas robustas, calibrándolas de forma guiada para eliminar errores.",
      feedbackYes: "La medición subjetiva limita la comparabilidad entre grupos y debilita las decisiones de desarrollo.",
      feedbackNo: "Tener instrumentos compartidos reduce fricción para escalar calidad y defender resultados.",
      icon: "⚖️"
    },
    {
      id: "operacion",
      title: "Operación y Adopción",
      question: "¿La capacitación compite con operación y se posterga por falta de formatos ágiles?",
      struggle: "La capacitación corporativa compite de forma constante con los horarios operativos y metas de entrega de la planta. Retirar al personal por largas jornadas detiene la productividad y genera fricción interna en Recursos Humanos.",
      solution: "Enfoque de clases modulares. Los microcursos son ágiles, puntuales e implementables en el puesto técnico con menor fricción operativa y mejores condiciones para la adopción.",
      feedbackYes: "Cuando la operación percibe la capacitación como interrupción, conviene modularizar y priorizar por brechas.",
      feedbackNo: "Si la adopción es fluida, la siguiente mejora es asegurar trazabilidad y continuidad metodológica.",
      icon: "🧩"
    },
    {
      id: "ia",
      title: "IA Controlada",
      question: "¿Tu equipo usa IA sin lineamientos, criterios o revisión metodológica?",
      struggle: "Temes que el staff de instructores utilice herramientas de IA libres para generar materiales inconsistentes, erróneos, de baja calidad o que vulneren las políticas corporativas de confidencialidad y marca del negocio.",
      solution: "Instauramos directrices claras de IA aplicada con control y criterios. Tu equipo es capacitado utilizando un manual de buenas prácticas, prompts oficiales autorizados y criterios estrictos de curaduría para que RH no pierda el control.",
      feedbackYes: "La velocidad sin criterios puede multiplicar errores. La IA necesita gobernanza, no solo acceso.",
      feedbackNo: "Excelente: los lineamientos son una ventaja si se conectan con entregables e indicadores.",
      icon: "🤖"
    },
    {
      id: "riesgo",
      title: "Riesgo y Cumplimiento",
      question: "¿Sería difícil defender la capacitación ante auditoría, inspección o comité?",
      struggle: "Necesitas sustentar tus capacitaciones ante requerimientos del marco legal de la Secretaría del Trabajo y Previsión Social (STPS), sistemas de excelencia de la industria o inspecciones regulatorias directas.",
      solution: "Estructura diseñada bajo pautas de estándares de competencia nacionales. Facilitamos el registro de constancias de competencias de la STPS formato DC-3 y el soporte técnico elemental para revisiones regulatorias.",
      feedbackYes: "La debilidad no es capacitar poco; suele ser no poder demostrar método, evidencia y trazabilidad.",
      feedbackNo: "Si la defensa documental ya existe, conviene convertirla en una práctica institucional escalable.",
      icon: "🛡️"
    }
  ];

  const diagnosticResult = getMaturityResult(diagnosticAnswers, painPoints);
  const roiEstimate = calculateRoiEstimate(roiInputs);

  const answerDiagnostic = (value: boolean) => {
    setDiagnosticAnswers((current) => {
      const next = [...current];
      next[activeDiagnosticStep] = value;
      trackConsultiveEvent('diagnostic_step_answered', {
        step: activeDiagnosticStep + 1,
        riskId: painPoints[activeDiagnosticStep].id,
        hasRisk: value
      });
      return next;
    });
  };

  const goToDiagnosticStep = (step: number) => {
    setActiveDiagnosticStep(step);
    trackConsultiveEvent('diagnostic_step_viewed', { step: step + 1, riskId: painPoints[step].id });
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute top-20 right-4 w-[34rem] h-[34rem] bg-brand-orange/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-8 left-0 w-[28rem] h-[28rem] bg-brand-learning/10 rounded-full blur-3xl opacity-70"></div>
        
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 cademmy-chip text-brand-slate px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.22em] mb-8 uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-red"></span>
              SISTEMA DE GOBERNANZA · 30 HRS + 4 HRS ONLINE · HASTA 30 PARTICIPANTES
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-brand-ink mb-8 leading-[1.04] tracking-tight">
              Estandariza toda la capacitación de tu organización.
            </h1>
            <p className="text-lg md:text-xl text-brand-slate mb-8 leading-relaxed max-w-2xl font-medium">
              Cuando cada instructor enseña diferente, la organización pierde consistencia, evidencia y capacidad para demostrar resultados. Instructor 4.0 convierte la capacitación en un sistema institucional medible, auditable y escalable.
            </p>

            <div className="grid sm:grid-cols-4 gap-3 mb-10 max-w-4xl">
              {['Método institucional', 'Evidencia por participante', 'IA con gobernanza', 'Ruta opcional a certificación'].map((chip) => (
                <div key={chip} className="cademmy-chip rounded-2xl px-4 py-3 text-sm font-bold text-brand-ink">
                  {chip}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button 
                onClick={onBookingClick}
                className="px-8 py-4.5 cademmy-primary rounded-2xl font-bold text-base transition text-center"
              >
                Obtén un Diagnóstico Ejecutivo
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4.5 glass-panel text-brand-ink rounded-2xl font-bold text-base hover:bg-white/80 transition text-center"
              >
                Ver cómo funciona
              </button>
            </div>

            <p className="text-xs text-brand-muted font-bold mb-12">
              Ruta opcional a certificación CONOCER: EC0217.01 y EC0301. La certificación se obtiene por evaluación; el certificado se emite solo si el candidato resulta competente.
            </p>
            
            {/* Trust and Compliance Badges for B2B */}
            <div className="pt-8 border-t border-white/80 flex flex-wrap gap-x-8 gap-y-4 items-center justify-start text-left">
              <div>
                <p className="text-[10px] text-brand-muted font-extrabold uppercase tracking-widest mb-1">CONTROL DOC</p>
                <p className="text-sm font-bold text-brand-ink">Evidencia trazable</p>
              </div>
              <div className="sm:border-l sm:border-white/80 sm:pl-6">
                <p className="text-[10px] text-brand-muted font-extrabold uppercase tracking-widest mb-1">CUMPLIMIENTO</p>
                <p className="text-sm font-bold text-brand-ink">Soporte STPS / calidad</p>
              </div>
              <div className="border-l border-white/80 pl-6">
                <p className="text-[10px] text-brand-muted font-extrabold uppercase tracking-widest mb-1 font-sans">CERTIFICACIÓN</p>
                <p className="text-sm font-bold text-brand-ink">Ruta opcional CONOCER</p>
              </div>
              <div className="border-l border-white/80 pl-6">
                <p className="text-[10px] text-brand-muted font-extrabold uppercase tracking-widest mb-1">COMPRAS</p>
                <p className="text-sm font-bold text-brand-ink">Propuesta formal</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-[2rem] overflow-hidden glass-card p-5 md:p-6">
              <div className="relative min-h-[430px] rounded-[1.5rem] bg-brand-ink overflow-hidden p-6 md:p-8 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(245,130,31,0.35),transparent_18rem),radial-gradient(circle_at_85%_18%,rgba(26,111,232,0.22),transparent_16rem),radial-gradient(circle_at_50%_88%,rgba(31,173,98,0.20),transparent_18rem)]"></div>
                <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full border-[18px] border-brand-orange/30"></div>
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-yellow mb-2">Sistema Instructor 4.0</p>
                    <h2 className="font-display text-3xl font-black text-white leading-tight">Mapa de estandarización RH</h2>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl">🎯</div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                  {[
                    ['01', 'Método común', 'Encuadre · conducción · cierre'],
                    ['02', 'Evaluación', 'Rúbricas · listas · guías'],
                    ['03', 'Evidencia', 'Portafolio por participante'],
                    ['04', 'IA aplicada', 'Planeación con criterios']
                  ].map(([num, title, text]) => (
                    <div key={num} className="rounded-2xl bg-white/10 border border-white/15 p-4 backdrop-blur-md">
                      <p className="text-brand-yellow font-black text-xs mb-3">{num}</p>
                      <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                      <p className="text-white/60 text-[11px] font-semibold leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="relative z-10 rounded-2xl bg-white/95 text-brand-ink p-5 shadow-2xl">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-brand-muted uppercase tracking-[0.22em] font-black">Cohorte corporativa</p>
                      <p className="text-2xl font-black">$67,660 MXN</p>
                    </div>
                    <span className="rounded-full bg-brand-certification/10 text-brand-certification px-3 py-1 text-[10px] font-black uppercase tracking-widest">34 hrs</span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-muted-bg overflow-hidden">
                    <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-brand-orange to-brand-red"></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-brand-muted">
                    <span>Diagnóstico</span>
                    <span>Microcursos</span>
                    <span>Demo IA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic Section */}
      <section id="pain-points" className="py-28 border-y border-white/70">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">PORTAL DE DIAGNÓSTICO</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">
              ¿Cuántos de estos 7 riesgos existen actualmente en tu organización?
            </h2>
            <p className="text-brand-muted mt-4 text-lg font-medium leading-relaxed">
              Responde con criterio ejecutivo. Al final verás un nivel de madurez y una ruta inicial para conversar con tu comité.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto mb-10">
            <div className="lg:col-span-4 flex flex-col gap-2">
              {painPoints.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => goToDiagnosticStep(index)}
                  className={`p-4 text-left rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-between border ${
                    activeDiagnosticStep === index
                      ? 'bg-brand-ink text-white border-brand-ink shadow-md'
                      : 'glass-panel text-brand-slate hover:text-brand-ink hover:bg-white/80'
                  }`}
                  aria-current={activeDiagnosticStep === index ? 'step' : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {item.title}
                  </span>
                  <span className="text-xs font-mono">
                    {diagnosticAnswers[index] === null ? (activeDiagnosticStep === index ? '➔' : '+') : diagnosticAnswers[index] ? 'Riesgo' : 'Base'}
                  </span>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8 glass-card p-8 md:p-12 rounded-[2rem] flex flex-col justify-between">
              <div>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-brand-muted uppercase tracking-widest">
                    <span>Paso {activeDiagnosticStep + 1} de 7</span>
                    <span>{diagnosticResult.answered}/7 respondidos</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-orange to-brand-red transition-all duration-500"
                      style={{ width: `${(diagnosticResult.answered / painPoints.length) * 100}%` }}
                    />
                  </div>
                </div>

                <span className="text-4xl mb-4 inline-block">{painPoints[activeDiagnosticStep].icon}</span>
                <h3 className="text-2xl md:text-3xl font-black text-brand-ink mb-4">
                  {painPoints[activeDiagnosticStep].question}
                </h3>
                <p className="text-sm text-brand-muted font-semibold leading-relaxed mb-8">
                  {painPoints[activeDiagnosticStep].struggle}
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  <button
                    onClick={() => answerDiagnostic(true)}
                    className={`rounded-2xl px-5 py-4 text-left border transition focus:outline-none focus:ring-4 focus:ring-brand-orange/20 ${
                      diagnosticAnswers[activeDiagnosticStep] === true ? 'bg-brand-red/10 border-brand-red text-brand-ink' : 'bg-white/70 border-white hover:border-brand-red/40'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest text-brand-red mb-1">Sí existe</span>
                    <span className="text-sm font-bold">Debe atenderse como brecha.</span>
                  </button>
                  <button
                    onClick={() => answerDiagnostic(false)}
                    className={`rounded-2xl px-5 py-4 text-left border transition focus:outline-none focus:ring-4 focus:ring-brand-certification/20 ${
                      diagnosticAnswers[activeDiagnosticStep] === false ? 'bg-brand-certification/10 border-brand-certification text-brand-ink' : 'bg-white/70 border-white hover:border-brand-certification/40'
                    }`}
                  >
                    <span className="block text-xs font-black uppercase tracking-widest text-brand-certification mb-1">No actualmente</span>
                    <span className="text-sm font-bold">Puede ser una fortaleza base.</span>
                  </button>
                </div>

                {diagnosticAnswers[activeDiagnosticStep] !== null && (
                  <div className="p-6 bg-brand-certification/5 rounded-2xl border border-brand-certification/10 mb-8">
                    <p className="text-[10px] font-bold text-brand-certification uppercase tracking-widest mb-2">Retroalimentación ejecutiva</p>
                    <p className="text-sm text-brand-ink font-medium leading-relaxed mb-3">
                      {diagnosticAnswers[activeDiagnosticStep]
                        ? painPoints[activeDiagnosticStep].feedbackYes
                        : painPoints[activeDiagnosticStep].feedbackNo}
                    </p>
                    <p className="text-sm text-brand-ink font-medium leading-relaxed">
                      <strong>Respuesta del sistema:</strong> {painPoints[activeDiagnosticStep].solution}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <button
                    onClick={() => goToDiagnosticStep(Math.max(0, activeDiagnosticStep - 1))}
                    disabled={activeDiagnosticStep === 0}
                    className="px-5 py-3 rounded-xl glass-panel text-sm font-bold disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => goToDiagnosticStep(Math.min(painPoints.length - 1, activeDiagnosticStep + 1))}
                    disabled={activeDiagnosticStep === painPoints.length - 1}
                    className="px-5 py-3 rounded-xl bg-brand-ink text-white text-sm font-bold disabled:opacity-40"
                  >
                    Siguiente riesgo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto glass-card rounded-[2rem] p-8 md:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">Resultado de tu Diagnóstico</span>
                <h3 className="font-display text-3xl md:text-4xl font-black text-brand-ink mb-4">{diagnosticResult.level.name}</h3>
                <p className="text-sm text-brand-muted font-semibold leading-relaxed mb-6">{diagnosticResult.level.summary}</p>
                <div className="h-3 rounded-full bg-white/80 overflow-hidden mb-3">
                  <div className={`h-full rounded-full ${diagnosticResult.level.tone} transition-all duration-500`} style={{ width: diagnosticResult.level.width }} />
                </div>
                <p className="text-xs text-brand-muted font-bold">Lógica: menor número de riesgos activos = mayor madurez de gobernanza.</p>
              </div>
              <div className="lg:col-span-7 grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/70 border border-white p-5">
                  <h4 className="font-black text-brand-ink mb-3">Fortalezas actuales</h4>
                  <ul className="space-y-2 text-sm text-brand-slate font-semibold">
                    {(diagnosticResult.strengths.length ? diagnosticResult.strengths : ['Completa el diagnóstico para identificar fortalezas']).map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl bg-brand-red/5 border border-brand-red/10 p-5">
                  <h4 className="font-black text-brand-ink mb-3">Brechas principales</h4>
                  <ul className="space-y-2 text-sm text-brand-slate font-semibold">
                    {(diagnosticResult.gaps.length ? diagnosticResult.gaps : ['Sin brechas críticas marcadas hasta ahora']).map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
                <div className="md:col-span-2 rounded-2xl bg-brand-certification/5 border border-brand-certification/10 p-5">
                  <h4 className="font-black text-brand-ink mb-3">Acciones recomendadas</h4>
                  <div className="grid sm:grid-cols-3 gap-3 text-sm text-brand-slate font-semibold">
                    {diagnosticResult.actions.map((item) => <span key={item}>• {item}</span>)}
                  </div>
                  <button
                    onClick={() => {
                      trackConsultiveEvent('diagnostic_report_cta_clicked', { level: diagnosticResult.level.name, risks: diagnosticResult.risks });
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-6 px-6 py-3 cademmy-primary rounded-xl font-bold text-sm"
                  >
                    Recibir mi Reporte Ejecutivo
                  </button>
                  <p className="mt-3 text-xs text-brand-muted font-semibold">El reporte se prepara en la sesión ejecutiva; esta página deja listo el punto de integración con formulario/CRM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before / After Transformation */}
      <section className="py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">TRANSFORMACIÓN OPERATIVA</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">Así cambia una organización</h2>
            <p className="text-brand-muted mt-4 text-lg font-medium leading-relaxed">
              El valor no está en tomar más cursos, sino en operar la capacitación con método, evidencia y capacidad de mejora continua.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-[2rem] p-8 border-t-4 border-t-brand-red/70">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-red mb-5">Antes: capacitación dependiente de personas</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Cada instructor enseña diferente', 'Sólo existen listas de asistencia', 'Evaluaciones subjetivas', 'Conocimiento dependiente del instructor', 'Sin trazabilidad', 'Documentación dispersa', 'Resultados difíciles de comparar', 'Calidad variable entre áreas'].map((item) => (
                  <div key={item} className="rounded-2xl bg-brand-red/5 border border-brand-red/10 p-4 text-sm font-bold text-brand-slate">{item}</div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-[2rem] p-8 border-t-4 border-t-brand-certification">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-certification mb-5">Después: gobernanza de capacitación</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {['Método institucional', 'Portafolio por participante', 'Rúbricas compartidas', 'Comparabilidad', 'Gobernanza', 'Documentación estructurada', 'Evidencia verificable', 'Escalabilidad entre áreas e instructores'].map((item) => (
                  <div key={item} className="rounded-2xl bg-brand-certification/5 border border-brand-certification/10 p-4 text-sm font-bold text-brand-slate">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost of Inaction */}
      <section className="py-28 border-y border-white/70">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">DECISIÓN EJECUTIVA</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">¿Qué cuesta no estandarizar?</h2>
            <p className="text-brand-muted mt-4 text-lg font-medium leading-relaxed">
              Estas consecuencias son plausibles en operaciones de capacitación sin método común. La sesión ejecutiva ayuda a dimensionarlas en tu contexto.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Variabilidad entre instructores', 'Cada facilitador decide estructura, lenguaje y criterios.', 'La experiencia cambia entre grupos y se pierde comparabilidad.'],
              ['Pérdida por rotación', 'El conocimiento vive en personas clave.', 'Cuando cambian de rol, el método se vuelve difícil de reconstruir.'],
              ['Dificultades ante auditorías', 'La evidencia queda incompleta o dispersa.', 'RH invierte tiempo reconstruyendo trazabilidad después del curso.'],
              ['Retrabajo y duplicidad', 'Cada instructor crea materiales desde cero.', 'Se repiten esfuerzos y se desaprovechan activos reutilizables.'],
              ['IA sin criterios', 'Se generan contenidos rápidos, pero no necesariamente coherentes.', 'La organización gana velocidad sin control metodológico.'],
              ['Presupuesto difícil de justificar', 'Se reportan horas impartidas, no evidencias comparables.', 'El comité ve gasto, pero no capacidad instalada.']
            ].map(([title, occurs, impact]) => (
              <div key={title} className="glass-card rounded-[1.75rem] p-6 hover:-translate-y-1 transition">
                <h3 className="text-lg font-black text-brand-ink mb-4">{title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-2">Qué ocurre</p>
                <p className="text-sm text-brand-slate font-semibold leading-relaxed mb-4">{occurs}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Capacidad que se pierde</p>
                <p className="text-sm text-brand-slate font-semibold leading-relaxed">{impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Benefits Section */}
      <section id="benefits" className="py-28">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">VENTAJA CORPORATIVA</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">
            Beneficios para Dirección de RH y L&D
          </h2>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed mt-4">
            Lo que obtienes al estandarizar instructores internos: método, evidencia y control (sin frenar operación).
          </p>
        </div>
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {ORG_BENEFITS.map((benefit, idx) => (
            <div key={idx} className="p-8 rounded-[1.75rem] glass-card hover:-translate-y-1 transition duration-300 flex flex-col">
              <div className="text-4xl mb-6 bg-white/70 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-white">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-brand-ink shrink-0">{benefit.title}</h3>
              <p className="text-brand-slate leading-relaxed font-semibold text-sm flex-1">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explanatory Block B2B */}
      <section id="how-it-works" className="py-24 border-y border-white/70">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="font-display text-4xl font-black text-brand-ink tracking-tight mb-6">
            Así funciona Instructor 4.0
          </h2>
          <p className="text-lg text-brand-muted mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
            Un mecanismo práctico para convertir capacitación interna en una operación con diagnóstico, método, evidencia y mejora continua.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="glass-card p-8 rounded-[1.75rem] hover:-translate-y-1 transition">
              <div className="text-4xl mb-6">🧩</div>
              <h3 className="text-lg font-bold mb-3 text-brand-ink">1. Diagnóstico y selección por brechas</h3>
              <p className="text-brand-muted text-sm leading-relaxed font-semibold">
                Inscribe a tus instructores en los módulos que atacan brechas reales (método, evaluación, evidencia), cuidando agenda y presupuesto.
              </p>
            </div>
            <div className="glass-card p-8 rounded-[1.75rem] hover:-translate-y-1 transition">
              <div className="text-4xl mb-6">🛤️</div>
              <h3 className="text-lg font-bold mb-3 text-brand-ink">2. Ruta completa (método + evidencia)</h3>
              <p className="text-brand-muted text-sm leading-relaxed font-semibold">
                Estandariza el ciclo completo: planeación, conducción, evaluación y portafolio para calidad replicable.
              </p>
            </div>
            <div className="glass-card p-8 rounded-[1.75rem] border-t-4 border-t-brand-orange hover:-translate-y-1 transition">
              <div className="text-4xl mb-6">📜</div>
              <h3 className="text-lg font-bold mb-3 text-brand-ink">3. Certificación opcional (por evaluación)</h3>
              <p className="text-brand-muted text-sm leading-relaxed font-semibold">
                La certificación nacional oficial (EC0217.01 y EC0301) es opcional y se obtiene a través de una evaluación por competencias independiente. El certificado se emite por CONOCER únicamente al resultar Competente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Demonstration */}
      <section className="py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">DEMOSTRACIÓN DEL SISTEMA</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">De planeación a expediente auditable</h2>
            <p className="text-brand-muted mt-4 text-lg font-medium leading-relaxed">
              En la sesión ejecutiva se muestran ejemplos de entregables. Esta representación ilustra el flujo sin sustituir una demo real.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-5">
            {[
              ['Objetivos SMART-Bloom', 'Define metas observables y alineadas a dominio cognitivo, psicomotor o afectivo.', 'Produce: carta descriptiva y criterios de logro.'],
              ['Rúbricas y listas', 'Convierte criterios en instrumentos compartidos para evaluar con menos subjetividad.', 'Produce: instrumentos comparables.'],
              ['IA con lineamientos', 'Acelera redacción y revisión con prompts y reglas de curaduría.', 'Produce: materiales consistentes.'],
              ['Expediente del participante', 'Agrupa evidencias, resultados y observaciones para consulta posterior.', 'Produce: trazabilidad documental.'],
              ['Portafolio digital', 'Organiza entregables de producto, desempeño y conocimiento.', 'Produce: estructura RH-Ready.'],
              ['Evaluación', 'Integra diagnóstica, formativa y sumativa con criterios claros.', 'Produce: decisiones de mejora.'],
              ['Documentación del instructor', 'Conserva planes de sesión, recursos y acuerdos de aprendizaje.', 'Produce: método replicable.'],
              ['Indicadores', 'Resume avance, brechas y evidencia pendiente.', 'Produce: visibilidad ejecutiva.']
            ].map(([title, problem, evidence]) => (
              <div key={title} className="glass-card rounded-[1.75rem] p-6">
                <div className="h-28 rounded-2xl bg-brand-ink text-white p-4 mb-5 overflow-hidden">
                  <div className="h-2 w-16 rounded-full bg-brand-orange mb-4" />
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/50 w-full" />
                    <div className="h-2 rounded-full bg-white/30 w-3/4" />
                    <div className="h-2 rounded-full bg-brand-certification/70 w-1/2" />
                  </div>
                </div>
                <h3 className="font-black text-brand-ink mb-3">{title}</h3>
                <p className="text-sm text-brand-slate font-semibold leading-relaxed mb-3">{problem}</p>
                <p className="text-xs text-brand-orange font-black uppercase tracking-wider">{evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustrative Case + ROI */}
      <section className="py-28 border-y border-white/70">
        <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-card rounded-[2rem] p-8">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">CASO ILUSTRATIVO</span>
            <h2 className="font-display text-3xl font-black text-brand-ink mb-6">Timeline preparado para evidencia real</h2>
            <p className="text-sm text-brand-muted font-semibold leading-relaxed mb-8">
              No se muestran clientes ni resultados no verificados. Esta estructura queda lista para incorporar un caso real cuando Cademmy autorice datos, testimonios o indicadores.
            </p>
            <div className="space-y-4">
              {['Problema', 'Diagnóstico', 'Implementación', 'Adopción', 'Resultado', 'Indicadores'].map((step, index) => (
                <div key={step} className="flex gap-4 items-start">
                  <span className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">{index + 1}</span>
                  <div>
                    <h3 className="font-black text-brand-ink">{step}</h3>
                    <p className="text-sm text-brand-slate font-semibold">Placeholder editable para evidencia real del proyecto.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 glass-card rounded-[2rem] p-8">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">CALCULADORA ORIENTATIVA</span>
            <h2 className="font-display text-3xl font-black text-brand-ink mb-6">Capacidad potencial de estandarización</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                ['instructors', 'Número de instructores', 1, 80],
                ['courses', 'Cursos internos al año', 1, 120],
                ['participants', 'Participantes anuales', 10, 3000],
                ['documentationHours', 'Horas de documentación por curso', 1, 40],
                ['frequency', 'Frecuencia anual por curso', 1, 12]
              ].map(([key, label, min, max]) => (
                <label key={key} className="block">
                  <span className="text-xs font-black uppercase tracking-widest text-brand-muted">{label}</span>
                  <input
                    type="number"
                    min={min as number}
                    max={max as number}
                    value={roiInputs[key as keyof RoiInputs]}
                    onChange={(event) => {
                      const value = Math.max(Number(min), Number(event.target.value) || Number(min));
                      setRoiInputs((current) => ({ ...current, [key as keyof RoiInputs]: value }));
                      trackConsultiveEvent('roi_calculator_changed', { field: key, value });
                    }}
                    className="mt-2 w-full rounded-xl border border-white bg-white/80 px-4 py-3 font-bold text-brand-ink focus:outline-none focus:ring-4 focus:ring-brand-orange/20"
                  />
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                ['Métodos a estandarizar', roiEstimate.methods],
                ['Expedientes potenciales', roiEstimate.potentialFiles],
                ['Instrumentos requeridos', roiEstimate.instruments],
                ['Rúbricas administrables', roiEstimate.rubrics],
                ['Evidencias organizadas', roiEstimate.evidenceItems],
                ['Horas potencialmente evitadas', roiEstimate.avoidableDocumentationHours]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/70 border border-white p-4">
                  <p className="text-2xl font-black text-brand-ink">{value}</p>
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-brand-muted font-semibold leading-relaxed">
              Esta estimación es orientativa y depende del proceso actual, el nivel de adopción y la configuración de la organización. No representa un resultado garantizado.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Trust + Demo Proof */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">CADEMMY</span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-brand-ink tracking-tight mb-6">
              Innovación educativa con criterio corporativo
            </h2>
            <p className="text-brand-slate leading-relaxed font-medium">
              En Cademmy impulsamos la transformación de la enseñanza a través de la innovación educativa y la profesionalización de instructores, docentes y facilitadores. Somos una organización especializada en el desarrollo de talento mediante cursos alineados a estándares de competencia laboral avalados por el CONOCER. Combinamos la pedagogía tradicional con herramientas de inteligencia artificial para ofrecer experiencias formativas prácticas, actuales y enfocadas en resultados. Nuestro compromiso es formar líderes de aprendizaje capaces de impactar positivamente en sus entornos educativos y organizacionales.
            </p>
          </div>

          <div className="lg:col-span-5 bg-brand-ink text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 blur-[90px]"></div>
            <div className="relative z-10">
              <span className="text-xs font-bold text-brand-yellow uppercase tracking-[0.3em] mb-4 inline-block">DEMO EN SESIÓN</span>
              <h2 className="font-display text-3xl font-black text-white tracking-tight mb-6">
                Diferenciador que sí puedes ver
              </h2>
              <div className="space-y-4">
                {[
                  'Generador SMART-Bloom: objetivos y secuencias coherentes',
                  'Portafolio digital: evidencias y trazabilidad por participante',
                  'Mesa Redonda IA: simulación crítica con retroalimentación'
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-start text-sm font-semibold text-white/85">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-certification shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof and Authority */}
      <section className="py-24 border-y border-white/70">
        <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">PRUEBA SOCIAL</span>
            <h2 className="font-display text-3xl font-black text-brand-ink mb-6">Organizaciones donde este sistema puede generar valor</h2>
            <p className="text-sm text-brand-muted font-semibold leading-relaxed mb-6">
              Espacio preparado para logos, sectores o testimonios reales. No se muestran marcas ni citas hasta contar con autorización expresa.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {['Plantas industriales', 'Universidades corporativas', 'Equipos de calidad', 'Áreas de RH / L&D', 'Operaciones multi-sede', 'Capacitación técnica'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/70 border border-white p-4 text-sm font-bold text-brand-slate">{item}</div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8 md:p-10">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">AUTORIDAD Y TRANSPARENCIA</span>
            <h2 className="font-display text-3xl font-black text-brand-ink mb-6">¿Por qué confiar en este sistema?</h2>
            <div className="space-y-4">
              {[
                ['Alineación metodológica', 'El contenido toma como referencia competencias de EC0217.01 y EC0301 sin presentarse como certificación automática.'],
                ['Evaluación separada', 'La evaluación formal y emisión de certificados CONOCER son procesos independientes y dependen del dictamen competente.'],
                ['Gobernanza documental', 'El sistema prioriza instrumentos, portafolios y evidencia organizada para soporte interno.'],
                ['IA bajo criterio', 'La IA se usa como apoyo para planeación y evaluación, manteniendo revisión humana y criterios institucionales.']
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-white/70 border border-white p-5">
                  <h3 className="font-black text-brand-ink mb-2">{title}</h3>
                  <p className="text-sm text-brand-slate font-semibold leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Micro-courses Catalog Section */}
      <section id="modules" className="py-28">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">FICHA CURRICULAR MODULAR</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">
            Estructura y calendarización para comité
          </h2>
          <p className="text-lg text-brand-muted font-medium max-w-3xl mx-auto mt-4">
            Paquete institucional recomendado: 34 horas de taller para hasta 30 participantes. Abajo se muestra el desglose por microcurso para compras, finanzas y planeación de agenda.
          </p>
        </div>
        
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl">
          {MODULES.map(module => (
            <ModuleCard 
              key={module.id} 
              module={module} 
              onViewDetails={onModuleClick}
              onBuy={onModuleClick}
            />
          ))}
        </div>

        {/* Corporate Deliverables Summary */}
        <div className="container mx-auto px-6 mt-32 max-w-6xl">
          <div className="bg-brand-ink text-white rounded-[2rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange blur-[120px] opacity-10"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="font-display text-3xl md:text-5xl font-black mb-8 tracking-tight text-white">Entregables ejecutivos para tu organización</h2>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">📋</div>
                    <div>
                      <h4 className="font-bold text-white">Manuales de Gobernanza de IA</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Estructura para el uso inteligente de herramientas con criterios de confidencialidad y control interno.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">🗄️</div>
                    <div>
                      <h4 className="font-bold text-white">Cartas Descriptivas Normalizadas</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Plantilla institucional en Excel y Word que sirve de eje central para cualquier auditoría de calidad.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">📊</div>
                    <div>
                      <h4 className="font-bold text-white">Instrumentos de Diagnóstico y Rúbricas</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Hojas de cotejo y de observación andragógica listas para calibrar evaluadores internos de la marca.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">🛡️</div>
                    <div>
                      <h4 className="font-bold text-white">Soporte documental STPS (DC-3)</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Documentación aplicable para respaldar planes de capacitación cuando corresponda.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                {/* Evolution Visual */}
                <div className="bg-white/5 p-8 rounded-[1.75rem] border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider text-xs">Transformación de Capacitación Interna</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Antes de Instructor 4.0</p>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">Antes dependía del criterio individual de cada instructor (mucha variabilidad).</p>
                    </div>
                    <div className="flex justify-center text-brand-orange font-bold text-lg">↓</div>
                    <div className="p-4 bg-brand-orange/15 rounded-xl border border-brand-orange/30">
                      <p className="text-[10px] font-bold text-brand-bright-orange uppercase mb-1">Con Instructor 4.0 Corporativo</p>
                      <p className="text-xs text-white font-medium leading-relaxed">Syllabus unificados, portafolios de evidencias, trazabilidad y documentación para soporte de cumplimiento.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Group Pricing and Plans Section */}
      <section id="pricing" className="py-28 border-t border-white/70">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">FORMALIZACIÓN</span>
          <h2 className="font-display text-4xl md:text-5xl font-black text-brand-ink tracking-tight">
            Planes de Estandarización Corporativa
          </h2>
          <p className="text-brand-muted max-w-2xl mx-auto text-lg font-medium leading-relaxed mt-4">
            Selecciona el volumen de profesionalización idóneo para calibrar las competencias formativas de tu negocio:
          </p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 max-w-6xl items-stretch">
          {/* Plan 1 */}
          <div className="glass-card p-8 rounded-[1.75rem] flex flex-col justify-between hover:-translate-y-1 transition">
            <div>
              <span className="text-[10px] text-brand-vino font-black uppercase tracking-widest bg-brand-vino/10 px-3 py-1.5 rounded-full inline-block mb-6">PROYECTO PILOTO</span>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">Obtienes</p>
              <h3 className="text-2xl font-bold text-brand-ink mb-2">Validación piloto del sistema</h3>
              <p className="text-sm text-brand-muted mb-6 font-medium">Idóneo para calibrar de 1 a 3 instructores clave, probar entregables y decidir si conviene escalar a una cohorte completa.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-brand-ink">$7,990</span>
                <span className="text-xs font-bold text-brand-muted"> MXN + IVA / instructor</span>
              </div>
              <ul className="space-y-3 text-xs text-brand-slate font-semibold mb-8">
                <li className="flex items-center gap-2">✔ Ruta completa de 34 horas por instructor</li>
                <li className="flex items-center gap-2">✔ Proyecto piloto para validar adopción y evidencias</li>
                <li className="flex items-center gap-2">✔ Soporte para registro STPS / formatos DC-3 (cuando aplique, sujeto a regulaciones)</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-iniciador')}
              className="w-full py-4 glass-panel hover:bg-white/80 text-brand-ink transition rounded-2xl font-bold text-sm uppercase tracking-wider"
            >
              Cotizar Plan Iniciador
            </button>
          </div>

          {/* Plan 2 */}
          <div className="glass-card p-8 rounded-[1.75rem] border-2 border-brand-orange flex flex-col justify-between shadow-lg relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow">
              MÁS SOLICITADO
            </div>
            <div>
              <span className="text-[10px] text-brand-orange font-black uppercase tracking-widest bg-brand-orange/10 px-3 py-1.5 rounded-full inline-block mb-6">ESCALAMIENTO DE EQUIPO</span>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">Obtienes</p>
              <h3 className="text-2xl font-bold text-brand-ink mb-2">Gobernanza para una cohorte completa</h3>
              <p className="text-sm text-brand-muted mb-6 font-medium">Implementa el sistema con hasta 30 participantes: método común, instrumentos, evidencia y ruta opcional a certificación.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-brand-ink">$67,660</span>
                <span className="text-xs font-bold text-brand-muted"> MXN / ruta corporativa total</span>
              </div>
              <ul className="space-y-3 text-xs text-brand-slate font-semibold mb-8">
                <li className="flex items-center gap-2 text-brand-orange">✔ Los 7 microcursos con 34 horas de instrucción en vivo</li>
                <li className="flex items-center gap-2">✔ Eliminamos costo extra de alineación grupal</li>
                <li className="flex items-center gap-2">✔ Expedientes electrónicos para auditorías ISO 9001</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-equipos')}
              className="w-full py-4 cademmy-primary transition rounded-2xl font-bold text-sm uppercase tracking-wider"
            >
              Cotizar Plan Equipos
            </button>
          </div>

          {/* Plan 3 */}
          <div className="glass-card p-8 rounded-[1.75rem] flex flex-col justify-between hover:-translate-y-1 transition">
            <div>
              <span className="text-[10px] text-brand-bright-orange font-black uppercase tracking-widest bg-brand-bright-orange/10 px-3 py-1.5 rounded-full inline-block mb-6">CUSTOM CO-CREACIÓN</span>
              <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">Obtienes</p>
              <h3 className="text-2xl font-bold text-brand-ink mb-2">Sistema adaptado a operación interna</h3>
              <p className="text-sm text-brand-muted mb-6 font-medium">Co-creación de ejemplos, instrumentos y casos con base en procesos, lenguaje y prioridades de tu organización.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-brand-ink">Custom</span>
                <span className="text-xs font-bold text-brand-muted"> / bajo cotización</span>
              </div>
              <ul className="space-y-3 text-xs text-brand-slate font-semibold mb-8">
                <li className="flex items-center gap-2">✔ Retos construidos con datos propios de su planta</li>
                <li className="flex items-center gap-2">✔ Portabilidad para sus servidores o LMS</li>
                <li className="flex items-center gap-2">✔ Auditoría directa y sustento ISO y STPS</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-enterprise')}
              className="w-full py-4 bg-brand-ink hover:bg-black text-white transition rounded-2xl font-bold text-sm uppercase tracking-wider"
            >
              Solicitar Propuesta In-Company
            </button>
          </div>
        </div>

        {/* Commercial transparency without artificial urgency */}
        <div className="container mx-auto px-6 max-w-6xl mt-16">
          <div className="glass-card rounded-[2rem] p-8 border border-brand-orange/20">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-3">Transparencia comercial</p>
            <p className="text-sm text-brand-slate font-semibold leading-relaxed">
              Si tu organización implementa la ruta completa, se puede bonificar al 100% el costo de alineación del estándar. La evaluación formal y la emisión del certificado CONOCER son procesos independientes; el certificado se paga únicamente cuando el candidato realiza la evaluación y resulta competente.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-28 border-t border-white/70">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">SOPORTE Y TRANSPARENCIA</span>
            <h2 className="font-display text-4xl font-black text-brand-ink tracking-tight">
              Preguntas Frecuentes (FAQ)
            </h2>
            <p className="text-brand-muted mt-4 text-base font-medium leading-relaxed">
              Resolvemos tus dudas sobre costos, metodologías, certificaciones oficiales de la SEP/CONOCER y la integración in-company de Instructor 4.0.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen 
                      ? 'border-brand-orange bg-white/70 shadow-sm'
                      : 'border-white/80 glass-card hover:border-brand-orange/30'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4.5 md:px-8 md:py-6 flex justify-between items-center gap-4 outline-none group transition-all"
                  >
                    <span className={`text-sm md:text-base font-extrabold transition-colors duration-200 ${isOpen ? 'text-brand-orange' : 'text-brand-ink group-hover:text-brand-orange'}`}>
                      {item.question}
                    </span>
                    <span className={`text-xs font-bold shrink-0 transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center border ${
                      isOpen 
                        ? 'border-brand-orange bg-brand-orange/10 text-brand-orange rotate-180' 
                        : 'border-white/80 text-brand-muted group-hover:bg-white/70'
                    }`}>
                      ↓
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 pointer-events-none'
                    } overflow-hidden`}
                  >
                    <div className="px-5 py-4.5 md:px-8 md:py-6 text-xs md:text-sm text-brand-slate leading-relaxed font-semibold">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section B2B Form */}
      <section id="contact" className="py-28 border-t border-white/70">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-brand-ink rounded-[2rem] overflow-hidden shadow-2xl grid md:grid-cols-12 items-stretch border border-white/10 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,130,31,0.24),transparent_28rem)]"></div>
            <div className="p-10 md:p-14 md:col-span-6 text-white flex flex-col justify-between relative z-10">
              <div>
                <h2 className="text-4xl font-black mb-6 tracking-tighter">Obtén un Diagnóstico Ejecutivo</h2>
                <p className="text-base opacity-80 mb-10 font-semibold leading-relaxed">
                  En una sesión de 30 minutos analizaremos tu operación actual y definiremos una ruta inicial para estandarizar la capacitación de tu organización.
                </p>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mb-10">
                  Sin compromiso comercial. La sesión se enfoca en identificar brechas, prioridades y siguientes pasos.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">📞</div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-0.5">WhatsApp Ventas Corporativas</p>
                    <p className="text-base font-bold">+52 55 5293 9203</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl shrink-0">✉️</div>
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-0.5">Contacto L&D</p>
                    <p className="text-base font-bold">contacto@cademmy.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 md:p-14 bg-white/90 backdrop-blur-xl md:col-span-6 flex flex-col justify-center items-center text-center relative z-10">
              <div className="w-16 h-16 bg-brand-yellow/10 text-brand-orange rounded-2xl flex items-center justify-center text-3xl mb-6">📆</div>
              <h3 className="text-2xl font-bold text-brand-ink mb-2">Microsoft Bookings</h3>
              <p className="text-brand-muted mb-8 font-medium leading-relaxed text-sm">
                Agenda directamente una llamada estratégica en el calendario de nuestros especialistas o escanea el QR corporativo.
              </p>
              
              <div className="mb-8 p-3 bg-white border border-gray-150 rounded-2xl shadow-sm">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Foutlook.office.com%2Fbook%2FCapacitacin%40cademmy.com%2Fs%2FHVJt3t5X7USNjKT-8Uz8nQ2%3Fismsaljsauthenabled" 
                  alt="Corporate Bookings QR" 
                  className="w-28 h-28"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button 
                onClick={onBookingClick}
                className="w-full py-4.5 cademmy-primary uppercase tracking-wider rounded-2xl font-bold text-sm transition-all"
              >
                Obtener Diagnóstico Ejecutivo ➔
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
