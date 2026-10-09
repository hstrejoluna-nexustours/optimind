import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Built-in scientific heuristic analyzer (Seligman learned optimism heuristics)
function generateRuleBasedCoaching(data: any) {
  const adversity = (data.adversity || '').trim();
  const belief = (data.belief || '').trim();
  const lowerB = belief.toLowerCase();

  // Detect Permanence indicators
  const permanentKeywords = ['siempre', 'nunca', 'jamás', 'invariablemente', 'todo el tiempo', 'por siempre'];
  const hasPermanentClue = permanentKeywords.some(kw => lowerB.includes(kw));

  // Detect Pervasiveness indicators
  const universalKeywords = ['todo', 'nada', 'mi vida entera', 'arruino todo', 'en todas partes', 'cualquier cosa'];
  const hasUniversalClue = universalKeywords.some(kw => lowerB.includes(kw));

  // Detect Internalization indicators
  const internalKeywords = ['soy un', 'soy una', 'inútil', 'incompetente', 'fracasado', 'mi culpa', 'no sirvo', 'torpe', 'tonto', 'tonta'];
  const hasInternalClue = internalKeywords.some(kw => lowerB.includes(kw));

  const permanenceStatus = hasPermanentClue || data.classifications?.permanent ? 'Permanente (Peligro pesimista)' : 'Temporal (Optimista/Flexible)';
  const pervasivenessStatus = hasUniversalClue || data.classifications?.universal ? 'Universal (Generalización excesiva)' : 'Específico (Acotado)';
  const personalizationStatus = hasInternalClue || data.classifications?.internal ? 'Interno destructivo' : 'Causas múltiples / Circunstancial';

  return {
    tutorNote: "Análisis cognitivo según el modelo de Martin Seligman:",
    adversityAudit: adversity.includes('por mi culpa') || adversity.includes('fracasé totalmente') 
      ? "Nota sobre la Adversidad (A): Procura redactar únicamente los hechos observables (qué, cuándo, quién) sin adjetivos auto-recriminatorios."
      : "Tu Adversidad (A) describe el hecho de manera objetiva. Excelente base para el trabajo cognitivo.",
    diagnostic: {
      permanence: permanenceStatus,
      pervasiveness: pervasivenessStatus,
      personalization: personalizationStatus,
      summary: `La creencia refleja una tendencia a atribuir causas ${hasPermanentClue ? 'permanentes' : 'temporales'} y ${hasUniversalClue ? 'universales' : 'específicas'}. Desafiarla restaurará la sensación de autoeficacia.`
    },
    suggestedRefutations: {
      evidence: [
        `¿Qué hechos concretos y verificables contradicen que esto sea '${hasPermanentClue ? 'para siempre' : 'un fracaso absoluto'}'?`,
        "Registra al menos 2 ocasiones previas en que manejaste una situación similar con éxito o aprendizaje."
      ],
      alternatives: [
        "¿Qué otros factores externos o del entorno (tiempo, recursos, cansancio, expectativas ajenas) intervinieron además de tu acción?",
        "Formula la causa como algo transitorio y modificable: 'En esta ocasión faltó afinar X factor específico'."
      ],
      decatastrophizing: [
        "Aún si las cosas salieron mal hoy, ¿cuál es el peor desenlace real? ¿Pone en riesgo tu integridad básica?",
        "Calcula la probabilidad real del peor escenario: usualmente es menor al 10% y manejable paso a paso."
      ],
      utility: [
        "¿Repetir este pensamiento te da claridad para actuar o te sume en la parálisis rumiativa?",
        "Aplica la técnica de Interrupción de Seligman: di firmemente '¡BASTA!' y enfócate en una micro-acción de 5 minutos."
      ]
    },
    flexibleRule: data.costOfFailure === 'high'
      ? "Regla de Seligman: Dado el ALTO COSTO del fracaso en este caso, se recomienda Pesimismo Prudente / Realista. Verifica planes de contingencia y mitiga riesgos antes de lanzarte."
      : "Regla de Seligman: Dado el BAJO COSTO del fracaso, aplica Optimismo Flexible. El costo de intentarlo es mínimo y el aprendizaje es alto."
  };
}

// API endpoint for OptiMind AI Coach
app.post('/api/optimind/coach', async (req, res) => {
  const { adversity, belief, classifications, consequences, costOfFailure, customQuestion } = req.body;

  // If no Gemini client or empty input, fallback immediately
  if (!aiClient || !belief) {
    const fallback = generateRuleBasedCoaching({ adversity, belief, classifications, costOfFailure });
    return res.json({ success: true, analysis: fallback, source: 'heuristics' });
  }

  try {
    const prompt = `Actúa estrictamente como "OptiMind", el tutor de Reestructuración Cognitiva y Optimismo Aprendido basado en el libro 'Learned Optimism' del Dr. Martin Seligman.
Analiza la siguiente entrada del usuario:

ADVERSIDAD (A): "${adversity || 'No especificada'}"
CREENCIA AUTOMÁTICA (B): "${belief}"
CLASIFICACIÓN DEL USUARIO:
- ¿Permanente?: ${classifications?.permanent ? 'Sí ("Siempre/Nunca")' : 'No ("Esta vez/Temporal")'}
- ¿Universal?: ${classifications?.universal ? 'Sí ("Todo me sale mal")' : 'No ("Específico a este hecho")'}
- ¿Interno?: ${classifications?.internal ? 'Sí ("Soy un inútil")' : 'No ("Causas circunstanciales / complejas")'}
CONSECUENCIA (C): Intensidad ${consequences?.intensity || 5}/10, Emociones: ${(consequences?.emotions || []).join(', ')}.
COSTO DEL FRACASO: ${costOfFailure || 'low'}
${customQuestion ? `PREGUNTA ESPECÍFICA DEL USUARIO: "${customQuestion}"` : ''}

Devuelve un JSON estricto con:
{
  "tutorNote": "Evaluación científica concisa, empática y rigurosa (máximo 2 párrafos). Cero optimismo ciego o frases vacías.",
  "adversityAudit": "Comentario sobre si la Adversidad está libre de juicios morales o si contiene distorsiones.",
  "diagnostic": {
    "permanence": "Explicación de la dimensión Permanencia en este pensamiento específico",
    "pervasiveness": "Explicación de la dimensión Amplitud en este pensamiento",
    "personalization": "Explicación de la dimensión Personalización",
    "summary": "Resumen del impacto en la pauta explicativa"
  },
  "suggestedRefutations": {
    "evidence": ["Pregunta o hecho 1 para buscar evidencia factual", "Pregunta o hecho 2"],
    "alternatives": ["Explicación alternativa 1 (modificable y específica)", "Explicación alternativa 2"],
    "decatastrophizing": ["Evaluación realista del peor escenario y su costo real"],
    "utility": ["Pauta para frenar la rumiación o usar la orden mental '¡Basta!'"]
  },
  "flexibleRule": "Recomendación según la regla del costo del fracaso de Seligman (Pesimismo Prudente si costo alto, Optimismo Flexible si costo bajo)."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      return res.json({ success: true, analysis: parsed, source: 'gemini' });
    } else {
      throw new Error('Respuesta vacía de Gemini');
    }
  } catch (error) {
    console.warn('Gemini coaching fallback triggered:', error);
    const fallback = generateRuleBasedCoaching({ adversity, belief, classifications, costOfFailure });
    return res.json({ success: true, analysis: fallback, source: 'heuristics' });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OptiMind server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
