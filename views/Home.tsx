import React, { useState } from 'react';
import { MODULES, GENERAL_BENEFITS } from '../constants';
import ModuleCard from '../components/ModuleCard';
import { PromotionCountdown } from '../components/PromotionCountdown';

interface HomeProps {
  onModuleClick: (id: string) => void;
  onFullCourseClick: (planId?: string) => void;
  onBookingClick: () => void;
}

const FAQ_ITEMS = [
  {
    question: "¿Qué es Instructor/Formador 4.0 para empresas?",
    answer: "Es un sistema de estandarización para instructores internos: proporciona una metodología común para planear, impartir y evaluar capacitación, generando instrumentos y evidencias por participante acelerado por herramientas digitales e Inteligencia Artificial."
  },
  {
    question: "¿Existe alguna promoción de certificación para mi grupo?",
    answer: "¡Sí! Si tu grupo o generación se inscribe a la Ruta Completa (los 7 microcursos), se bonifica al 100% el costo de $5,000 MXN correspondiente al proceso de evaluación formal independiente (alineación + plan de evaluación + evaluación en estándares EC0217.01 y EC0301). Bajo este beneficio exclusivo, solo se cubre el trámite indispensable de emisión oficial ante CONOCER de $1,500 MXN por participante, el cual se liquida únicamente cuando el candidato resulta dictaminado como 'Competente'."
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
    answer: "• Menos variabilidad metodológica en la impartición de tus instructores de planta.\n• Expedientes de evidencia 100% auditables (instrumentos + portafolio completo por participante).\n• Trazabilidad total de la asimilación del aprendizaje.\n• Una sólida base de reportabilidad para tus juntas de comité o auditorías regulatorias."
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
    answer: "En absoluto. Entendemos perfectamente el costo operativo de frenar líneas de producción o retirar ingenieros clave. Por ello, Instructor 4.0 opera bajo microcursos sumamente ágiles que se agendan in-company en horarios flexibles (presencial o híbrido) para adaptarse al 100% a la productividad de tus células de trabajo."
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
    answer: "El beneficio principal es que si inscribes a tus instructores a toda la ruta completa, eliminamos por completo el costo de la alineación grupal. Tu organización solo cubrirá los procesos individuales indispensables de evaluación formal ($5,000 MXN) y la emisión de certificado ($1,500 MXN) de aquellos facilitadores que decidan acreditarse formalmente ante el CONOCER."
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
    answer: "Sí, absolutamente. Al finalizar y aprobar cada microcurso, se emiten las Constancias de Competencias Laborales (Formato DC-3) registradas ante la Secretaría del Trabajo y Previsión Social (STPS). Estas constancias sustentan legalmente los planes de capacitación de tu empresa y son 100% deducibles de impuestos."
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
    answer: "Se emite factura fiscal correspondiente por cada servicio contratado. Las condiciones específicas de pago se detallan de forma clara y transparente en tu propuesta a la medida, siendo un gasto operativo 100% deducible."
  }
];

const Home: React.FC<HomeProps> = ({ onModuleClick, onFullCourseClick, onBookingClick }) => {
  const [activePainTab, setActivePainTab] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const painPoints = [
    {
      id: "roi",
      title: "Impacto y ROI",
      struggle: "Capacitas habilidades blandas o técnicas, pero los resultados no se vuelven observables y comparables. Te cuesta justificar inversión porque falta un sistema de objetivos, instrumentos y evidencias por participante.",
      solution: "Instructor 4.0 conecta objetivos, actividades e instrumentos para generar evidencia por participante y criterios comparables entre grupos. La capacitación deja de ser “solo horas” y se vuelve una mejora verificable.",
      icon: "📈"
    },
    {
      id: "evidencia",
      title: "Auditoría y Evidencias",
      struggle: "Solo tienes carpetas de hojas firmadas como listas de asistencia y encuestas superficiales de satisfacción (las cuales no prueban aprendizaje). Ante auditorías de calidad o sistemas de gestión interna, la capacitación es difícil de sustentar técnicamente.",
      solution: "Creamos portafolios de evidencias digitales de cada participante, listos en segundos. Esto te otorga un expediente transparente con listas de cotejo, resultados ponderados, firmas de acuerdos y rúbricas analíticas estructuradas.",
      icon: "📊"
    },
    {
      id: "estandar",
      title: "Estandarización",
      struggle: "Tu capacitación interna es inconsistente. Dependes de un 'instructor estrella' empírico; si esa persona se va o es promovida, todo el know-how metodológico de impartición técnica se pierde o se diluye, creando silos de información.",
      solution: "Institucionaliza un protocolo oficial corporativo uniforme de encuadre, conducción participativa, cierre, medición de conocimientos y archivo documental, de tal modo que cualquier experto técnico pueda dar clases con el mismo estándar de calidad.",
      icon: "🧬"
    },
    {
      id: "evaluacion",
      title: "Evaluación Científica",
      struggle: "No existen rúbricas ni criterios formales de calificación; la asimilación del staff se evalúa 'a ojo' u ojeando un cuestionario de memoria superficial, lo cual no comprueba destrezas de desempeño práctico en su área operativa diaria.",
      solution: "Enseñamos a tus instructores a formular e implementar Guías de Observación de comportamientos de seguridad, Listas de Cotejo de entregables físicos corporativos y Rúbricas analíticas robustas, calibrándolas de forma guiada para eliminar errores.",
      icon: "⚖️"
    },
    {
      id: "operacion",
      title: "Operación y Adopción",
      struggle: "La capacitación corporativa compite de forma constante con los horarios operativos y metas de entrega de la planta. Retirar al personal por largas jornadas detiene la productividad y genera fricción interna en Recursos Humanos.",
      solution: "Enfoque de clases modulares. Los microcursos son ágiles, puntales e implementables al instante en el puesto técnico sin interrumpir dinámicas críticas, garantizando excelentes tasas de adopción en la planta.",
      icon: "🧩"
    },
    {
      id: "ia",
      title: "IA Controlada",
      struggle: "Temes que el staff de instructores utilice herramientas de IA libres para generar materiales inconsistentes, erróneos, de baja calidad o que vulneren las políticas corporativas de confidencialidad y marca del negocio.",
      solution: "Instauramos directrices claras de IA aplicada con control y criterios. Tu equipo es capacitado utilizando un manual de buenas prácticas, prompts oficiales autorizados y criterios estrictos de curaduría para que RH no pierda el control.",
      icon: "🤖"
    },
    {
      id: "riesgo",
      title: "Riesgo y Cumplimiento",
      struggle: "Necesitas sustentar tus capacitaciones ante requerimientos del marco legal de la Secretaría del Trabajo y Previsión Social (STPS), sistemas de excelencia de la industria o inspecciones regulatorias directas.",
      solution: "Estructura diseñada bajo pautas de estándares de competencia nacionales. Facilitamos el registro de constancias de competencias de la STPS formato DC-3 y el soporte técnico elemental para revisiones regulatorias.",
      icon: "🛡️"
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-brand-vino/5 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-[0.25em] mb-8 shadow-sm uppercase">
              ★ ALINEACIÓN CORPORATIVA B2B (CONOCER) · EC0217.01 + EC0301
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tighter">
              Estandariza tu capacitación interna con <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-brand-red to-brand-vino">IA aplicada y evidencia auditable</span>.<br />
              <span className="text-xl md:text-2xl font-extrabold text-gray-500 block mt-4">Ruta opcional a certificación CONOCER (EC0217.01 + EC0301).</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl font-medium">
              Diseñado para Dirección de RH y L&D. Convierte expertos técnicos en instructores consistentes con un método único para planear, conducir y evaluar capacitación, generando instrumentos y evidencias por participante para revisión interna y toma de decisiones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button 
                onClick={() => document.getElementById('pain-points')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4.5 bg-brand-orange text-white rounded-xl font-bold text-base hover:bg-brand-red transition shadow-lg shadow-brand-orange/20 text-center"
              >
                Ver diagnóstico RH (2 min)
              </button>
              <button 
                onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4.5 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-black transition text-center shadow-lg shadow-black/10"
              >
                Explorar fichas técnicas
              </button>
            </div>

            <p className="text-xs text-gray-400 font-bold mb-12">
              *La certificación se obtiene por evaluación y se emite solo si el candidato resulta competente.
            </p>
            
            {/* Trust and Compliance Badges for B2B */}
            <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-x-8 gap-y-4 items-center justify-start text-left">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">CONTROL DOC</p>
                <p className="text-sm font-bold text-gray-700">Evidencia auditable</p>
              </div>
              <div className="sm:border-l sm:border-gray-100 sm:pl-6">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">LEGALIDAD MÉXICO</p>
                <p className="text-sm font-bold text-gray-700">DC-3 (STPS), ISO 9000</p>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1 font-sans">RECONOCIMIENTO</p>
                <p className="text-sm font-bold text-gray-700">Reconocimiento CONOCER</p>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1">FISCALIDAD</p>
                <p className="text-sm font-bold text-gray-700">100% facturable</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-x-4 border-y-4 border-gray-100 flex justify-center bg-gray-50">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" 
                alt="Directores de capacitación planeando" 
                className="w-full h-auto object-cover max-h-[500px]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Interactive Diagnostic Section */}
      <section id="pain-points" className="py-28 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">PORTAL DE DIAGNÓSTICO</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              ¿Qué impide que tu capacitación sea <span className="text-brand-orange">medible y defendible</span>?
            </h2>
            <p className="text-gray-500 mt-4 text-lg font-medium leading-relaxed">
              Selecciona tus retos principales para ver cómo el sistema Instructor 4.0 te da gobernanza, evidencia y decisiones más claras.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Left Nav Tabs */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              {painPoints.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActivePainTab(index)}
                  className={`p-4 text-left rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-between border ${
                    activePainTab === index
                      ? 'bg-brand-vino text-white border-brand-vino shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-orange hover:bg-brand-orange/5'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {item.title}
                  </span>
                  <span className="text-xs font-mono">{activePainTab === index ? '➔' : '+'}</span>
                </button>
              ))}
            </div>

            {/* Right Display Panel */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-4xl mb-4 inline-block">{painPoints[activePainTab].icon}</span>
                <h3 className="text-2xl font-black text-gray-900 mb-6">
                  Reto prioritario de RH (según tu selección)
                </h3>
                
                {/* Block: The Struggle */}
                <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100/60">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">El Reto en Recursos Humanos</p>
                  <p className="text-sm text-red-950 font-medium leading-relaxed">
                    {painPoints[activePainTab].struggle}
                  </p>
                </div>

                {/* Block: The Solution */}
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100/60">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">La Solución Instructor 4.0</p>
                  <p className="text-sm text-green-950 font-medium leading-relaxed">
                    {painPoints[activePainTab].solution}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span>Cademmy B2B Consulting Group</span>
                <span>Paso {activePainTab + 1} de 7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Benefits Section */}
      <section id="benefits" className="py-28 bg-white">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">VENTAJA CORPORATIVA</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Beneficios para Dirección de RH y L&D
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed mt-4">
            Lo que obtienes al estandarizar instructores internos: método, evidencia y control (sin frenar operación).
          </p>
        </div>
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {GENERAL_BENEFITS.map((benefit, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col">
              <div className="text-4xl mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 shrink-0">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed font-semibold text-sm flex-1">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explanatory Block B2B */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-6">
            Implementación por grupo o generación (sin frenar la operación)
          </h2>
          <p className="text-lg text-gray-600 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
            Nuestro programa se amolda a tu giro técnico o comercial sin interrumpir las jornadas de trabajo.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-6">🧩</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">1. Diagnóstico y selección por brechas</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-semibold">
                Inscribe a tus instructores en los módulos que atacan brechas reales (método, evaluación, evidencia), cuidando agenda y presupuesto.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="text-4xl mb-6">🛤️</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">2. Ruta completa (método + evidencia)</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-semibold">
                Estandariza el ciclo completo: planeación, conducción, evaluación y portafolio para calidad replicable.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-t-4 border-t-brand-orange hover:shadow-md transition">
              <div className="text-4xl mb-6">📜</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">3. Certificación opcional (por evaluación)</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-semibold">
                La certificación nacional oficial (EC0217.01 y EC0301) es opcional y se obtiene a través de un examen independiente. El certificado se emite por CONOCER únicamente al resultar Competente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Micro-courses Catalog Section */}
      <section id="modules" className="py-28 bg-white">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">FICHA CURRICULAR MODULAR</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Biblioteca de Módulos (Fichas Técnicas)
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-3xl mx-auto mt-4">
            Selecciona los módulos críticos para tu equipo. Configura tu grupo / generación a la medida.
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
          <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange blur-[120px] opacity-10"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter">Entregables Ejecutivos para tu Organización:</h2>
                <div className="grid gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shrink-0">📋</div>
                    <div>
                      <h4 className="font-bold text-white">Manuales de Gobernanza de IA</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Estructura para el uso inteligente y seguro de herramientas sin fugas de secretos industriales.</p>
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
                      <h4 className="font-bold text-white">Constancias Oficiales STPS (DC-3)</h4>
                      <p className="text-sm text-gray-400 font-semibold mt-1">Registros con validez oficial ante las inspecciones laborales federales de México.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                {/* Evolution Visual */}
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider text-xs">Transformación de Capacitación Interna</h3>
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Antes de Instructor 4.0</p>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">Antes dependía del criterio individual de cada instructor (mucha variabilidad).</p>
                    </div>
                    <div className="flex justify-center text-brand-orange font-bold text-lg">↓</div>
                    <div className="p-4 bg-brand-orange/15 rounded-xl border border-brand-orange/30">
                      <p className="text-[10px] font-bold text-brand-bright-orange uppercase mb-1">Con Instructor 4.0 Corporativo</p>
                      <p className="text-xs text-white font-medium leading-relaxed">Syllabus unificados, portafolios de evidencias generados con IA, transferencia al puesto y blindaje regulatorio STPS.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Group Pricing and Plans Section */}
      <section id="pricing" className="py-28 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center mb-20">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">FORMALIZACIÓN</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Planes de Estandarización Corporativa
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed mt-4">
            Selecciona el volumen de profesionalización idóneo para calibrar las competencias formativas de tu negocio:
          </p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 max-w-6xl items-stretch">
          {/* Plan 1 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <span className="text-[10px] text-brand-vino font-black uppercase tracking-widest bg-brand-vino/10 px-3 py-1.5 rounded-full inline-block mb-6">PROYECTO PILOTO</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Iniciador B2B</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Idóneo para equipar y calibrar de 1 a 3 instructores clave internos respetando de forma exacta la tarifa de $1,990 por hora.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">$1,990</span>
                <span className="text-xs font-bold text-gray-400"> MXN / hora de taller</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-600 font-semibold mb-8">
                <li className="flex items-center gap-2">✔ Tarifa fija por hora de capacitación grupal</li>
                <li className="flex items-center gap-2">✔ Agenda adaptada de 34 horas totales</li>
                <li className="flex items-center gap-2">✔ Soporte para registro STPS / formatos DC-3 (cuando aplique, sujeto a regulaciones)</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-iniciador')}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 transition rounded-xl font-bold text-sm uppercase tracking-wider"
            >
              Cotizar Plan Iniciador
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-white p-8 rounded-3xl border-2 border-brand-orange flex flex-col justify-between shadow-lg relative">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow">
              MÁS SOLICITADO
            </div>
            <div>
              <span className="text-[10px] text-brand-orange font-black uppercase tracking-widest bg-brand-orange/10 px-3 py-1.5 rounded-full inline-block mb-6">ESCALAMIENTO DE EQUIPO</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plan Ruta Unificada</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Profesionaliza equipos enteros (grupo de máximo 30 personas) en el pipeline completo de 34 horas por $67,660 MXN de inversión corporativa.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">$67,660</span>
                <span className="text-xs font-bold text-gray-400"> MXN / ruta corporativa total</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-600 font-semibold mb-8">
                <li className="flex items-center gap-2 text-brand-orange">✔ Los 7 microcursos con 34 horas de instrucción en vivo</li>
                <li className="flex items-center gap-2">✔ Eliminamos costo extra de alineación grupal</li>
                <li className="flex items-center gap-2">✔ Expedientes electrónicos para auditorías ISO 9001</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-equipos')}
              className="w-full py-4 bg-brand-orange hover:bg-brand-red text-white transition rounded-xl font-bold text-sm uppercase tracking-wider shadow-md shadow-brand-orange/20"
            >
              Cotizar Plan Equipos
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <span className="text-[10px] text-brand-bright-orange font-black uppercase tracking-widest bg-brand-bright-orange/10 px-3 py-1.5 rounded-full inline-block mb-6">CUSTOM CO-CREACIÓN</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">In-Company Enterprise</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Adaptación completa a su marca, problemas técnicos y manuales específicos de planta operativa.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                <span className="text-xs font-bold text-gray-400"> / bajo cotización</span>
              </div>
              <ul className="space-y-3 text-xs text-gray-600 font-semibold mb-8">
                <li className="flex items-center gap-2">✔ Retos construidos con datos propios de su planta</li>
                <li className="flex items-center gap-2">✔ Portabilidad para sus servidores o LMS</li>
                <li className="flex items-center gap-2">✔ Auditoría directa y sustento ISO y STPS</li>
              </ul>
            </div>
            <button 
              onClick={() => onFullCourseClick('plan-enterprise')}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white transition rounded-xl font-bold text-sm uppercase tracking-wider"
            >
              Solicitar Propuesta In-Company
            </button>
          </div>
        </div>

        {/* Dynamic Countdown Banner with Elegant Styling */}
        <div className="container mx-auto px-6 max-w-6xl mt-16">
          <PromotionCountdown />
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-28 bg-white border-t border-gray-150">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.3em] mb-4 inline-block">SOPORTE Y TRANSPARENCIA</span>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
              Preguntas Frecuentes (FAQ)
            </h2>
            <p className="text-gray-500 mt-4 text-base font-medium leading-relaxed">
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
                      ? 'border-brand-orange bg-brand-orange/[0.01]/10 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4.5 md:px-8 md:py-6 flex justify-between items-center gap-4 outline-none group transition-all"
                  >
                    <span className={`text-sm md:text-base font-extrabold transition-colors duration-200 ${isOpen ? 'text-brand-orange' : 'text-gray-900 group-hover:text-brand-orange'}`}>
                      {item.question}
                    </span>
                    <span className={`text-xs font-bold shrink-0 transition-transform duration-300 w-8 h-8 rounded-full flex items-center justify-center border ${
                      isOpen 
                        ? 'border-brand-orange bg-brand-orange/10 text-brand-orange rotate-180' 
                        : 'border-gray-200 text-gray-500 group-hover:bg-gray-50'
                    }`}>
                      ↓
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0 pointer-events-none'
                    } overflow-hidden`}
                  >
                    <div className="px-5 py-4.5 md:px-8 md:py-6 text-xs md:text-sm text-gray-600 leading-relaxed font-semibold">
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
      <section id="contact" className="py-28 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-r from-brand-vino via-brand-orange to-brand-vino rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-12 items-stretch border border-white/10">
            <div className="p-10 md:p-14 md:col-span-6 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-black mb-6 tracking-tighter">Agenda una Sesión de Diagnóstico B2B</h2>
                <p className="text-base opacity-80 mb-10 font-semibold leading-relaxed">
                  Permite a nuestros consultores senior evaluar las brechas metodológicas de tus facilitadores y diseñar un plan de desarrollo a la medida de tu presupuesto de Recursos Humanos.
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
            
            <div className="p-10 md:p-14 bg-white md:col-span-6 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-brand-yellow/10 text-brand-orange rounded-2xl flex items-center justify-center text-3xl mb-6">📆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Microsoft Bookings</h3>
              <p className="text-gray-500 mb-8 font-medium leading-relaxed text-sm">
                Agenda directamente una llamada estratégica de 15 minutos en el calendario de nuestros especialistas o escanea el QR corporativo.
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
                className="w-full py-4.5 bg-brand-orange hover:bg-brand-red text-white uppercase tracking-wider rounded-xl font-bold text-sm shadow-md shadow-brand-orange/20 transition-all"
              >
                Agendar sesión en Bookings ➔
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
