import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'modelo-abcde',
    term: 'Modelo ABCDE',
    pronunciation: 'A-B-C-D-E',
    shortDef: 'Marco de reestructuración cognitiva de Seligman (adaptado de Albert Ellis) para transformar el pesimismo automático.',
    fullExplanation: 'Descompone el impacto de un contratiempo en 5 fases secuenciales: A (Adversidad objetiva), B (Creencia o diálogo interno automático), C (Consecuencias emocionales y conductuales), D (Discusión o refutación activa mediante 4 cartas), y E (Energización y micro-acciones renovadas).',
    practicalExample: 'En vez de pasar de A (el cliente no contestó) directo a C (desánimo y dejar de llamar), insertas D (discutir que es la hora del almuerzo) para llegar a E (volver a llamar a las 3:00 pm).',
    tags: ['Núcleo ABCDE', 'Metodología', 'Herramientas'],
    seligmanQuote: 'La creencia B es la bisagra que conecta el hecho A con tu destino emocional C.'
  },
  {
    id: 'descatastrofizacion',
    term: 'Descatastrofización (Decatastrophizing)',
    shortDef: 'Técnica de evaluación empírica para calibrar el peor desenlace realista si la creencia fuera cierta.',
    fullExplanation: 'El cerebro con rumiación pesimista trata un desacuerdo o un error menor como si fuera una amenaza mortal para la supervivencia biológica. Descatastrofizar implica formular preguntas de sobriedad: ¿Es realmente el fin del mundo? Si esto sucede, ¿qué recursos concretos tengo para afrontar el día siguiente?',
    practicalExample: '"Si el proyecto se retrasa una semana, tendré que explicarlo en la junta. Será incómodo, pero conservo mi empleo y mi equipo sabe que fue un imprevisto técnico externo."',
    tags: ['Discusión D', 'Regulación Emocional'],
    seligmanQuote: 'La mente humana tiene un talento dramático para inventar tragedias que el 95% de las veces nunca ocurren.'
  },
  {
    id: 'pensamiento-no-negativo',
    term: 'Pensamiento No Negativo',
    shortDef: 'Neutralización activa de distorsiones cognitivas mediante la verificación factual, sin caer en afirmaciones vacías.',
    fullExplanation: 'A diferencia del "pensamiento positivo" tradicional (que exige autoelogios forzados), el pensamiento no negativo busca simplemente eliminar la falsedad destructiva. No te dices "soy el mejor", te dices: "no es verdad que sea incapaz; tengo evidencia de haber superado retos análogos en el pasado".',
    practicalExample: 'Remplazar "arruiné mi vida" por "cometí un error subsanable en el informe de las 10:00".',
    tags: ['Epistemología', 'Anti-Toxicidad'],
    seligmanQuote: 'La meta de la psicología cognitiva no es la euforia irreal, sino la paz que brinda la exactitud.'
  },
  {
    id: 'estilo-atributivo-asq',
    term: 'Estilo Atributivo (ASQ / CASQ)',
    shortDef: 'Cuestionarios científicos (Attributional Style Questionnaire) para medir las 3 dimensiones del optimismo.',
    fullExplanation: 'Diseñado por Seligman, Abramson y Semmel para evaluar el hábito explicativo de una persona ante eventos positivos y negativos. Mide Permanencia (PmB/PmG), Amplitud (PvB/PvG) y Personalización (PsB/PsG). Se utiliza tanto en adultos (ASQ) como en niños y adolescentes (CASQ).',
    practicalExample: 'Un puntaje bajo en Permanencia para eventos negativos predice mayor resistencia a la depresión y mayor longevidad inmunológica.',
    tags: ['Evaluación', 'Ciencia de Seligman'],
    seligmanQuote: 'Tu estilo explicativo es tan constante como tu firma, pero a diferencia de esta, puedes rediseñarlo conscientemente.',
    isPro: true,
    proBadge: 'Test ASQ Automatizado - Requiere Pro'
  },
  {
    id: 'patrones-cognitivos-complejos',
    term: 'Patrones Cognitivos Complejos (Deep Cognitive Triad)',
    shortDef: 'Análisis matricial de distorsiones entrelazadas y sesgos de confirmación en bucles de rumiación crónica.',
    fullExplanation: 'Examina cómo la creencia en la permanencia alimenta la amplitud y refuerza la personalización destructiva en la tríada cognitiva de Beck-Seligman. La versión Pro incluye auditoría algorítmica para detectar puntos ciegos mediante IA socrática.',
    practicalExample: 'Detectar cuándo un contratiempo profesional ("el cliente canceló") se expande automáticamente a una crisis relacional y existencial sin base empírica.',
    tags: ['Avanzado', 'Diagnóstico IA', 'Patrones'],
    seligmanQuote: 'Cuando desarmas el patrón central, los síntomas colaterales pierden su sustento emocional.',
    isPro: true,
    proBadge: 'Patrones Cognitivos Complejos - Requiere Pro'
  },
  {
    id: 'parada-del-pensamiento',
    term: 'Parada de Pensamiento / Distracción',
    shortDef: 'Técnicas de interrupción súbita para frenar bucles de rumiación obsesiva cuando la discusión racional no es viable.',
    fullExplanation: 'A veces una preocupación puede tener una pizca de verdad, pero insistir en pensarla a las 2 de la madrugada solo desgasta el sistema límbico. En esos momentos no se discute: se interrumpe activamente mediante la orden mental "¡Basta!", el cambio de foco sensorial o el aplazamiento deliberado para una hora específica de la mañana.',
    practicalExample: 'Usar un cuenco tibetano, tocar un objeto físico o anotar la preocupación en un papel cerrado para atenderla al día siguiente a las 10:00 am.',
    tags: ['Manejo de Rumiación', 'Herramientas'],
    seligmanQuote: 'La rumiación es como acelerar el motor con el coche en punto muerto: quema combustible sin avanzar un centímetro.'
  },
  {
    id: 'causa-modificable-inmutable',
    term: 'Causa Modificable vs. Causa Inmutable',
    shortDef: 'Distinción clave dentro de la dimensión de Permanencia para orientar la energía hacia lo que sí se puede transformar.',
    fullExplanation: 'Cuando una causa se atribuye a un rasgo fijo ("no tengo talento", "soy perezoso por naturaleza"), el individuo concluye que no vale la pena esforzarse. En cambio, cuando se atribuye a un factor modificable ("falta de preparación previa", "dormí 4 horas", "estrategia inadecuada"), la esperanza renace de inmediato.',
    practicalExample: 'Cambiar "no sirvo para los idiomas" por "llevo solo dos semanas practicando y necesito cambiar de aplicación".',
    tags: ['Las 3 Dimensiones', 'Perspectiva'],
    seligmanQuote: 'La esperanza nace cuando encuentras causas temporales y modificables a tus contratiempos.'
  },
  {
    id: 'indefension-aprendida',
    term: 'Indefensión Aprendida (Learned Helplessness)',
    shortDef: 'Condición psicológica caracterizada por la pasividad y el abandono tras haber experimentado dolor incontrolable.',
    fullExplanation: 'Teoría formulada en 1967. Describe la pérdida de motivación y el déficit cognitivo que surge cuando un individuo aprende que sus respuestas no tienen ningún efecto en las consecuencias que experimenta en su vida.',
    practicalExample: 'Un estudiante que tras reprobar tres exámenes deja de estudiar porque "de todas formas va a reprobar".',
    tags: ['Historia', 'Ciencia de Seligman'],
    seligmanQuote: 'El mayor peligro de la adversidad no es el dolor que causa, sino la falsa lección de que no tenemos salida.'
  },
  {
    id: 'regla-optimismo-flexible',
    term: 'Regla del Optimismo Flexible',
    shortDef: 'Criterio pragmático de Seligman: basar la elección entre optimismo o pesimismo en el costo potencial del fracaso.',
    fullExplanation: 'Si el costo de fallar es catastrófico, se impone el pesimismo prudente (auditar riesgos, prevenir contingencias). Si el costo es leve o transitorio, se impone el optimismo flexible (dar el salto, intentar, aprender del roce).',
    practicalExample: 'Pesimismo prudente al firmar una hipoteca de 30 años; optimismo flexible al invitar a un amigo a tomar un café.',
    tags: ['Toma de Decisiones', 'Metodología'],
    seligmanQuote: 'El optimista que ignora el costo del fracaso es un temerario; el que lo calcula es un estratega.',
    isPro: true,
    proBadge: 'Matriz Cuantitativa - Requiere Pro'
  }
];
