import { AbcdeEntry, ExplanatoryProfile } from '../types';

export interface CoachResponse {
  success: boolean;
  source: 'gemini' | 'heuristics';
  analysis: {
    tutorNote: string;
    adversityAudit?: string;
    diagnostic: {
      permanence: string;
      pervasiveness: string;
      personalization: string;
      summary: string;
    };
    suggestedRefutations: {
      evidence: string[];
      alternatives: string[];
      decatastrophizing: string[];
      utility: string[];
    };
    flexibleRule: string;
  };
}

export async function requestOptiMindCoach(params: {
  adversity: string;
  belief: string;
  classifications: { permanent: boolean; universal: boolean; internal: boolean };
  consequences?: { intensity: number; emotions: string[]; behavioralImpact?: string };
  costOfFailure?: 'low' | 'high' | 'moderate';
  customQuestion?: string;
}): Promise<CoachResponse> {
  try {
    const res = await fetch('/api/optimind/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    // Client-side fallback to scientific heuristics
    return getLocalHeuristicAnalysis(params);
  }
}

export function getLocalHeuristicAnalysis(params: {
  adversity: string;
  belief: string;
  classifications: { permanent: boolean; universal: boolean; internal: boolean };
  costOfFailure?: 'low' | 'high' | 'moderate';
}): CoachResponse {
  const b = params.belief.toLowerCase();
  const hasPermanent = b.includes('siempre') || b.includes('nunca') || b.includes('jamás') || params.classifications.permanent;
  const hasUniversal = b.includes('todo') || b.includes('nada') || b.includes('arruino') || params.classifications.universal;
  const hasInternal = b.includes('soy un') || b.includes('inútil') || b.includes('fracaso') || params.classifications.internal;

  return {
    success: true,
    source: 'heuristics',
    analysis: {
      tutorNote: "OptiMind (Protocolo Seligman): El objetivo no es engañarse con falsas esperanzas, sino desafiar las explicaciones destructivas que tu mente genera en automático.",
      adversityAudit: params.adversity.toLowerCase().includes('mi culpa') || params.adversity.toLowerCase().includes('fracasé')
        ? "Recomendación: Separa el hecho objetivo de tu propia sentencia interna. Limítate a lo que una cámara de video registraría."
        : "Adversidad bien delimitada. Hecho objetivo listo para ser analizado sin sesgos.",
      diagnostic: {
        permanence: hasPermanent ? "Permanente: Estás asumiendo que la causa persistirá indefinidamente." : "Temporal: Reconoces que es una causa puntual y pasajera.",
        pervasiveness: hasUniversal ? "Universal: Estás proyectando este contratiempo hacia todos los aspectos de tu vida." : "Específico: Mantienes el problema circunscrito a este evento.",
        personalization: hasInternal ? "Interno destructivo: Te estás culpando como persona en lugar de evaluar conductas o circunstancias." : "Circunstancial / Factores interactuantes: Atribución saludable.",
        summary: "La combinación de explicaciones permanentes y universales para eventos negativos es la principal causa de la indefensión aprendida."
      },
      suggestedRefutations: {
        evidence: [
          `¿Qué datos concretos y medibles demuestran que "${params.belief.slice(0, 40)}..." es una conclusión apresurada?`,
          "Recuerda al menos 2 hechos del pasado que demuestren tu capacidad para resolver retos de esta naturaleza."
        ],
        alternatives: [
          "¿Qué otras variables jugaron un rol (cansancio, ambigüedad de instrucciones, tiempo escaso, factores ajenos)?",
          "Reformula la causa hacia algo 100% modificable: 'En este intento específico falló X proceso, el cual puedo ajustar'."
        ],
        decatastrophizing: [
          "Si ocurriera el peor escenario previsto, ¿cuáles serían los daños reales? ¿Qué pasos concretos darías al día siguiente?",
          "Distingue entre un contratiempo incómodo y una catástrofe irreversible."
        ],
        utility: [
          "¿Repetir este pensamiento te da claridad operativa o solo drena tu energía? Usa la orden '¡BASTA!' para cortar el bucle.",
          "Difiere la preocupación: decide revisar el tema en una ventana de 15 minutos mañana a las 11:00 am."
        ]
      },
      flexibleRule: params.costOfFailure === 'high'
        ? "Regla de Seligman: Alto costo del fracaso detectado. Emplea Pesimismo Prudente: mitiga riesgos, elabora planes B y no te fíes solo del entusiasmo."
        : "Regla de Seligman: Bajo costo del fracaso. Aplica Optimismo Flexible: el riesgo es mínimo y el aprendizaje te fortalecerá."
    }
  };
}

// Compute Explanatory Profile metrics based on all saved workouts
export function computeExplanatoryProfile(entries: AbcdeEntry[]): ExplanatoryProfile {
  if (entries.length === 0) {
    return {
      permanenceScore: 50,
      pervasivenessScore: 50,
      personalizationScore: 50,
      totalWorkouts: 0,
      resilienceStreak: 1,
      lastWorkoutDate: new Date().toISOString(),
    };
  }

  let permCount = 0;
  let pervCount = 0;
  let internCount = 0;

  entries.forEach(e => {
    if (e.classifications.permanent) permCount++;
    if (e.classifications.universal) pervCount++;
    if (e.classifications.internal) internCount++;
  });

  const total = entries.length;

  return {
    permanenceScore: Math.round((permCount / total) * 100),
    pervasivenessScore: Math.round((pervCount / total) * 100),
    personalizationScore: Math.round((internCount / total) * 100),
    totalWorkouts: total,
    resilienceStreak: Math.max(1, total + 1), // Streak of completed workouts
    lastWorkoutDate: entries[0].createdAt,
  };
}
