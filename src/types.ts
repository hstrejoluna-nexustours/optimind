export interface ExplanatoryStyleClassification {
  permanent: boolean; // true = permanent ("siempre/nunca"), false = temporary ("esta vez")
  universal: boolean; // true = universal ("todo me sale mal"), false = specific ("este proyecto")
  internal: boolean;  // true = internal destructive ("soy un inútil"), false = external/complex
}

export interface RefutationalCards {
  evidence: string;        // 🕵️‍♂️ Evidencia factual
  alternatives: string;    // 🔀 Alternativas específicas y cambiables
  decatastrophizing: string; // 🔍 Descatastrofización / Costo real
  utility: string;         // 🎯 Utilidad / Interrupción del pensamiento
}

export interface AbcdeEntry {
  id: string;
  createdAt: string;
  title: string;
  // A: Adversidad
  adversity: string;
  category: 'trabajo' | 'relaciones' | 'salud_habitos' | 'estudio' | 'finanzas' | 'personal';
  // B: Creencia
  belief: string;
  classifications: ExplanatoryStyleClassification;
  // C: Consecuencias
  consequences: {
    intensity: number; // 1 to 10
    emotions: string[];
    behavioralImpact: string;
  };
  // D: Discusión (4 Cartas)
  refutations: RefutationalCards;
  // E: Energización
  energization: {
    newIntensity: number; // 1 to 10
    actionPlan: string;
    newBelief: string;
  };
  // Optimismo flexible
  costOfFailure: 'low' | 'high' | 'moderate';
  aiFeedback?: {
    tutorNote?: string;
    adversityAudit?: string;
    flexibleRule?: string;
  };
}

export interface ExplanatoryProfile {
  permanenceScore: number;   // 0 (100% temporal/optimista) to 100 (100% permanente/pesimista)
  pervasivenessScore: number; // 0 (100% específico/optimista) to 100 (100% universal/pesimista)
  personalizationScore: number; // 0 (constructivo/circunstancial) to 100 (autoinculpación tóxica)
  totalWorkouts: number;
  resilienceStreak: number;
  lastWorkoutDate: string;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  optionA: {
    text: string;
    permanent: boolean;
    universal: boolean;
    internal: boolean;
  };
  optionB: {
    text: string;
    permanent: boolean;
    universal: boolean;
    internal: boolean;
  };
}
