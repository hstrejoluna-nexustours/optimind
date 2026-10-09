import { AbcdeEntry, QuizQuestion } from '../types';

export const DAILY_REFLECTIONS = [
  {
    id: 'ref-1',
    quote: 'El optimismo aprendido no es una fe ciega en que todo saldrá bien; es el coraje sobrio de examinar qué depende de ti y saber que los tropiezos son temporales.',
    author: 'Dr. Martin Seligman',
    concept: 'La Transitoriedad del Tropiezo',
    prompt: '¿Qué dificultad que enfrentas hoy podrías calificar como un evento pasajero en vez de una condena permanente?'
  },
  {
    id: 'ref-2',
    quote: 'La habilidad para disputar tus propios pensamientos catastróficos es la mejor vacuna psicológica contra la indefensión aprendida.',
    author: 'Dr. Martin Seligman',
    concept: 'La Discusión Activa',
    prompt: 'Si un buen amigo te contara la preocupación que tienes hoy, ¿qué pruebas objetivas le presentarías para devolverle la serenidad?'
  },
  {
    id: 'ref-3',
    quote: 'Cuando el costo del fracaso es bajo, desata todo el optimismo posible. Cuando el costo es alto, la prudencia realista es tu mayor aliada.',
    author: 'Dr. Martin Seligman',
    concept: 'La Regla del Optimismo Flexible',
    prompt: '¿Cuál es el costo real si tu próximo intento no sale perfecto? ¿Es un peligro vital o simplemente una lección para ajustar el rumbo?'
  }
];

export const INITIAL_ENTRIES: AbcdeEntry[] = [
  {
    id: 'entry-seligman-demo-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    title: 'Rechazo de propuesta de optimización en la junta directiva',
    category: 'trabajo',
    adversity: 'Ayer presenté el plan de modernización de software ante el comité de dirección. El director financiero cuestionó el presupuesto y decidieron posponer la aprobación hasta el próximo trimestre.',
    belief: 'Nunca van a valorar mis iniciativas. Siempre que propongo algo importante me bloquean. Soy un mal comunicador y carezco de peso en la empresa; este rechazo demuestra que mi carrera está estancada.',
    classifications: {
      permanent: true,  // "Siempre", "Nunca", "mi carrera está estancada"
      universal: true,  // "Todo", carezco de peso en la empresa
      internal: true,   // "Soy un mal comunicador"
    },
    consequences: {
      intensity: 8,
      emotions: ['Frustración', 'Tristeza', 'Apatía', 'Impotencia'],
      behavioralImpact: 'Cancelé mis reuniones de la tarde, evité hablar con mi equipo y me fui temprano a casa rumiando el rechazo.',
    },
    refutations: {
      evidence: 'No es verdad que "siempre" me bloquean: hace 3 meses aprobaron la migración de servidores y el mes pasado elogiaron la auditoría de seguridad. Además, el director financiero no atacó mi capacidad técnica; cuestionó específicamente el flujo de caja del Q3.',
      alternatives: '1) La empresa enfrenta recortes temporales por la subida de tipos de interés. 2) Mi propuesta era financieramente densa; debí presentar un desglose por fases en lugar de una inversión en bloque.',
      decatastrophizing: 'El peor escenario es esperar 90 días o reestructurar el proyecto en tres entregables más pequeños. El proyecto no fue cancelado, fue pospuesto. Nadie dudó de mi empleo ni de mi reputación general.',
      utility: 'Pensar que "mi carrera está estancada" solo me paraliza y me hace parecer desanimado. Elijo una pausa consciente para soltar la rumiación y programo una sesión de 30 minutos con finanzas el jueves para revisar los números con calma.',
    },
    energization: {
      newIntensity: 3,
      newBelief: 'Este aplazamiento es un problema presupuestario puntual y técnico, no un juicio sobre mi valor profesional. Puedo modular el plan en fases asimilables.',
      actionPlan: '1) Solicitar los lineamientos presupuestarios del Q4 a finanzas mañana a las 10:00.\n2) Rediseñar la propuesta en 3 hitos escalables.\n3) Agradecer al director financiero su retroalimentación para involucrarlo como aliado.',
    },
    costOfFailure: 'low',
    aiFeedback: {
      tutorNote: 'Excelente desglose ABCDE. Lograste desactivar la tríada pesimista (Permanente -> Temporal; Universal -> Específico; Interno destructivo -> Factores presupuestarios contextuales).',
      adversityAudit: 'La Adversidad original es fáctica y concreta.',
      flexibleRule: 'El costo del fracaso en este ajuste es muy bajo. El Optimismo Flexible te capacita para volver a presentar sin resentimiento.'
    }
  },
  {
    id: 'entry-seligman-demo-2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    title: 'Interrupción del plan de entrenamiento físico',
    category: 'salud_habitos',
    adversity: 'Esta semana solo pude ir al gimnasio 1 día de los 4 programados debido a horas extras en el trabajo.',
    belief: 'No tengo fuerza de voluntad. Siempre que inicio una rutina saludable termino abandonando. No nací para tener disciplina física.',
    classifications: {
      permanent: true,
      universal: true,
      internal: true,
    },
    consequences: {
      intensity: 7,
      emotions: ['Culpa', 'Desesperanza', 'Pasividad'],
      behavioralImpact: 'Comí comida ultraprocesada por ansiedad y consideré cancelar la membresía.',
    },
    refutations: {
      evidence: 'Llevo 6 semanas continuas asistiendo con regularidad antes de esta semana pico. Un bache de 4 días no borra 42 días de constancia acumulada.',
      alternatives: 'La carga laboral fue extraordinaria por el cierre de mes fiscal (factor externo temporal). Mi nivel de energía física estaba agotado por dormir 5 horas, no por "falta de temple moral".',
      decatastrophizing: 'Perder 3 sesiones de pesas no reduce mi masa muscular ni arruina mi salud cardiovascular. El cuerpo se recuperó del cansancio acumulado.',
      utility: 'Castigarme con culpas solo aumenta las ganas de comer chatarra. Detengo el diálogo interno y empaco la maleta deportiva para mañana a las 7:00 am.',
    },
    energization: {
      newIntensity: 2,
      newBelief: 'La constancia no es perfección matemática, sino la capacidad de retomar el rumbo tras una semana atípica.',
      actionPlan: 'Hacer una sesión breve de 25 minutos mañana temprano centrada en movilidad y disfrute, sin sobreexigencia.',
    },
    costOfFailure: 'low',
    aiFeedback: {
      tutorNote: 'Desmontaste la falacia del "todo o nada". Reenmarcar la semana como anomalía transitoria protege la autoeficacia.',
      flexibleRule: 'Bajo costo de fracaso: Optimismo Aprendido total.'
    }
  }
];

export const SELIGMAN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'Haces una presentación importante y el público se muestra poco participativo.',
    optionA: {
      text: 'No sé mantener el interés de la gente, me falta carisma nato.',
      permanent: true,
      universal: true,
      internal: true,
    },
    optionB: {
      text: 'El tema era muy denso y el horario después del almuerzo no ayudó.',
      permanent: false,
      universal: false,
      internal: false,
    }
  },
  {
    id: 2,
    scenario: 'Olvidas pagar una factura a tiempo y te cobran un recargo.',
    optionA: {
      text: 'Soy un desastre total con mis responsabilidades financieras.',
      permanent: true,
      universal: true,
      internal: true,
    },
    optionB: {
      text: 'Se me pasó esta fecha porque cambiaron el formato de notificación.',
      permanent: false,
      universal: false,
      internal: false,
    }
  },
  {
    id: 3,
    scenario: 'Tienes una discusión áspera con tu pareja o amigo cercano.',
    optionA: {
      text: 'Nuestra relación nunca va a funcionar, siempre caemos en lo mismo.',
      permanent: true,
      universal: true,
      internal: true,
    },
    optionB: {
      text: 'Ambos estábamos bajo mucho estrés hoy por temas externos.',
      permanent: false,
      universal: false,
      internal: false,
    }
  },
  {
    id: 4,
    scenario: 'Postulas a un puesto laboral o beca y no quedas seleccionado.',
    optionA: {
      text: 'Nunca doy la talla en los procesos selectivos, soy mediocre.',
      permanent: true,
      universal: true,
      internal: true,
    },
    optionB: {
      text: 'Buscaban un perfil con más años en una herramienta específica.',
      permanent: false,
      universal: false,
      internal: false,
    }
  },
  {
    id: 5,
    scenario: 'Intentas aprender una nueva habilidad técnica (ej. programar o idioma) y te cuesta entender el primer módulo.',
    optionA: {
      text: 'Mi cerebro no está hecho para esto, no tengo el don.',
      permanent: true,
      universal: true,
      internal: true,
    },
    optionB: {
      text: 'La curva de inicio es empinada; necesito buscar otro recurso pedagógico.',
      permanent: false,
      universal: false,
      internal: false,
    }
  }
];
