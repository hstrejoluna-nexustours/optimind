import { WikiArticle } from '../types';

export const WIKI_ARTICLES: WikiArticle[] = [
  {
    id: 'que-es-el-optimismo-aprendido',
    title: '1. ¿Qué es el Optimismo Aprendido?',
    subtitle: 'Exactitud empírica frente al mito del "pensamiento positivo" ciego',
    category: 'Fundamentos Epistemológicos',
    readTime: '4 min de lectura',
    summary: 'El optimismo aprendido no consiste en repetir frases complacientes ante el espejo ni negar los problemas. Es una habilidad cognitiva para desarmar explicaciones destructivas automáticas utilizando la fuerza de la evidencia objetiva.',
    sections: [
      {
        title: 'Pensamiento No Negativo vs. Positividad Tóxica',
        content: `Existe una diferencia radical entre la autoayuda superficial y la psicología cognitiva experimental del Dr. Martin Seligman. La positividad tóxica exige mantener una sonrisa forzada y fingir que "todo pasa por una razón", lo cual suele derivar en culpa secundaria cuando las cosas salen mal.

En contraste, el Optimismo Aprendido promueve el Pensamiento No Negativo: una postura de sobriedad empírica. No te pides creer que el fracaso fue maravilloso; te pides no inventar catástrofes que los datos reales no respaldan.`,
        keyTakeaway: 'No se trata de inflar las esperanzas, sino de desinflar las conclusiones autodestructivas que no se apoyan en los hechos.'
      },
      {
        title: 'La Exactitud como Ancla de Tranquilidad',
        content: `Cuando sufrimos un contratiempo, el cerebro primitivo tiende al sesgo de negatividad evolutivo: asume el peor escenario para protegerte de depredadores. Sin embargo, en el mundo contemporáneo (laboral, relacional, académico), este sesgo genera parálisis innecesaria.

La práctica del optimismo consiste en auditar tus propios pensamientos como un científico imparcial: ¿es verdad que "siempre" fallo? ¿Es verdad que esto "arruinó toda mi vida"? Al exigir pruebas verificables, la angustia pierde su combustible irracional.`,
        keyTakeaway: 'El optimista aprendido no es un soñador ingenuo; es un detective implacable de la realidad objetiva.'
      }
    ]
  },
  {
    id: 'la-impotencia-aprendida',
    title: '2. La Impotencia Aprendida',
    subtitle: 'Cómo se adquiere la pasividad y cómo el control cognitivo rompe el ciclo',
    category: 'Neurociencia & Resiliencia',
    readTime: '5 min de lectura',
    summary: 'Descubierta en los laboratorios de la Universidad de Pensilvania en 1967, la indefensión aprendida es el estado psicológico en el que un individuo deja de intentar actuar porque cree erróneamente que sus acciones no alterarán el resultado.',
    sections: [
      {
        title: 'El Origen del Fenómeno',
        content: `En sus experimentos seminales, Seligman y Steve Maier descubrieron que cuando los sujetos eran expuestos a situaciones aversivas sobre las cuales no tenían control alguno, posteriormente, incluso cuando se les colocaba en un entorno donde escapar era sumamente fácil, ni siquiera intentaban moverse: se echaban a llorar y aceptaban el dolor pasivamente. Habían "aprendido" la impotencia.

En los seres humanos ocurre exactamente lo mismo: tras una serie de desengaños, despidos o rechazos, la persona concluye: "Da igual lo que haga, nada cambiará".`,
        keyTakeaway: 'La pasividad y la depresión reactiva no provienen del trauma en sí, sino de la creencia aprendida de que el esfuerzo futuro es inútil.'
      },
      {
        title: 'El Antídoto: La Agencia Cognitiva',
        content: `Sin embargo, Seligman notó que un tercio de los sujetos NUNCA se rendían. ¿Qué los protegía? Su Estilo Explicativo. Cuando experimentaban un revés, se decían a sí mismos que la imposibilidad era temporal y situacional, no una ley universal.

Romper la impotencia aprendida requiere experimentar micro-victorias deliberadas y reescribir la narrativa interna para restaurar el sentido de agencia: "No controlo el clima ni las decisiones de otros, pero sí controlo mi próximo paso durante los siguientes 15 minutos".`,
        keyTakeaway: 'La inmunización contra la impotencia se entrena desafiando activamente las generalizaciones de derrota.'
      }
    ]
  },
  {
    id: 'las-3-dimensiones-del-estilo-explicativo',
    title: '3. Las 3 Dimensiones del Estilo Explicativo',
    subtitle: 'Permanencia, Amplitud y Personalización: el prisma de tu diálogo interno',
    category: 'Métricas de Seligman',
    readTime: '6 min de lectura',
    summary: 'La forma en que te explicas las causas de los contratiempos determina si experimentarás vigor o apatía. Seligman identificó tres ejes métricos fundamentales.',
    sections: [
      {
        title: 'Dimensión 1: Permanencia (¿Cuándo?)',
        content: `• Pauta Pesimista: Causa permanente. Utiliza adverbios absolutos como "siempre", "nunca", "invariablemente". ("Nunca podré ahorrar dinero", "Siempre me pongo nervioso").
• Pauta Optimista: Causa temporal. Emplea marcadores transitorios como "esta vez", "últimamente", "hoy". ("Esta semana tuve gastos médicos imprevistos", "En esta presentación me faltó repasar la introducción").`,
        keyTakeaway: 'Si la causa es permanente, estás condenado; si la causa es temporal, el futuro está abierto.'
      },
      {
        title: 'Dimensión 2: Amplitud (¿Dónde y a qué afecta?)',
        content: `• Pauta Pesimista: Causa universal. Permite que un fracaso específico contamine toda la existencia. ("No le agrado al jefe, por tanto soy un fracaso profesional y nadie me respetará").
• Pauta Optimista: Causa específica. Confinar el problema estrictamente a su ámbito sin desbordamiento. ("Tuvimos una diferencia de criterio en la entrega del informe de ventas").`,
        keyTakeaway: 'Aislar el problema previene la metástasis del desánimo hacia tu familia, salud o descanso.'
      },
      {
        title: 'Dimensión 3: Personalización (¿Quién es el culpable?)',
        content: `• Pauta Pesimista: Causa interna destructiva. Sentencia la propia valía como ser humano. ("Soy un estúpido", "No sirvo para nada").
• Pauta Optimista: Causa interactuante / contextual. Reconoce errores de conducta o factores externos sin atacar la dignidad personal. ("Cometí un error en la fórmula del cálculo", "Las condiciones del mercado eran adversas").`,
        keyTakeaway: 'Responsabilidad conductual SÍ; autodestrucción ontológica NO.'
      }
    ]
  },
  {
    id: 'el-optimismo-flexible',
    title: '4. La Regla del Optimismo Flexible',
    subtitle: 'Cuándo abrazar el optimismo y cuándo recurrir al pesimismo prudente',
    category: 'Toma de Decisiones',
    readTime: '4 min de lectura',
    summary: 'Seligman advierte con firmeza: el optimismo irrestricto puede ser peligroso. La clave para usarlo con maestría reside en calcular con frialdad el costo del fracaso antes de lanzarse.',
    sections: [
      {
        title: 'La Pregunta Cardinal: ¿Cuál es el costo del fracaso?',
        content: `Antes de decidir qué actitud mental adoptar ante una encrucijada, plantéate la pregunta de oro:
"Si las cosas salen mal en esta decisión, ¿cuál es el peor desenlace real?"

• Si el costo del fracaso es ALTO (riesgo de quiebra patrimonial, daño físico, secuelas médicas severas o litigios legales): NO uses optimismo ciego. Emplea el Pesimismo Prudente / Realista. Revisa los detalles, busca fallos en el plan y contrata seguros.
• Si el costo del fracaso es BAJO (hacer una llamada de prospección, iniciar una conversación cordial, postular a una vacante, probar una receta): Emplea todo el Optimismo Aprendido. El costo de una negativa es insignificante comparado con el aprendizaje.`,
        keyTakeaway: 'El optimismo es una herramienta que se desenvaina o se guarda según el balance de riesgos.'
      },
      {
        title: 'El Valor del Realismo en Puestos Clave',
        content: `Las investigaciones de Seligman señalan que las empresas y las familias necesitan tanto a optimistas como a realistas precavidos. Un piloto de avión calculando combustible o un director de seguridad nuclear deben ser pesimistas prudentes; un vendedor, un creativo o un líder de equipo requieren optimismo flexible.`,
        keyTakeaway: 'La sabiduría no consiste en ser siempre optimista, sino en ser libre para elegir cuándo serlo.'
      }
    ]
  }
];
