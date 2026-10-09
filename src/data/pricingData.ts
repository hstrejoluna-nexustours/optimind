import { PricingPlan } from '../types';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free / Starter',
    badge: 'Comienza sin costo',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Para explorar los fundamentos del optimismo aprendido y comenzar tu reestructuración cognitiva.',
    features: [
      '3 Ejercicios ABCDE / mes',
      'Refutaciones cognitivas básicas',
      'Acceso completo a la Wiki del Optimismo',
      'Acceso al Glosario interactivo con marcadores',
      'Santuario y medidor diario de serenidad'
    ],
    notIncluded: [
      'Ejercicios ABCDE ilimitados',
      'IA de razonamiento profundo para las 4 Cartas',
      'Análisis de Patrones Cognitivos (3 Dimensiones)',
      'Exportación de Reporte Clínico en PDF / JSON',
      'Soporte Prioritario'
    ],
    ctaText: 'Continuar en Starter',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro / Resilience Pass',
    badge: 'Más Popular • Recomendado',
    priceMonthly: 9.99,
    priceYearly: 89, // Save ~25% / 2 months free ($89/yr vs $119.88/yr)
    description: 'La suite completa para transformar la rumiación automática en resiliencia mental duradera con IA profunda.',
    features: [
      'Ejercicios ABCDE ILIMITADOS cada mes',
      'IA de razonamiento profundo para las 4 Cartas',
      'Análisis continuo de Patrones Cognitivos (Permanencia, Amplitud, Causalidad)',
      'Exportación ejecutiva en PDF y JSON para sesiones',
      'Sincronización en tiempo real con Google Cloud Firestore',
      'Paisaje sonoro de lluvia zen ininterrumpido',
      'Racha de resiliencia persistente y métricas evolutivas',
      'Soporte Prioritario directo'
    ],
    ctaText: 'Comenzar Prueba Pro (14 Días)',
    popular: true
  },
  {
    id: 'executive',
    name: 'Executive / Coach',
    badge: 'Decoy Tier • Terapeutas y Coaches',
    priceMonthly: 29.99,
    priceYearly: 279, // Saves ~22%
    description: 'Para profesionales de salud mental, coaches ejecutivos y familias que gestionan múltiples usuarios.',
    features: [
      'Todo lo incluido en Pro / Resilience Pass',
      'Multi-perfil: gestión de hasta 5 perfiles o clientes',
      'Dashboard clínico de cliente / familia unificado',
      'Exportación avanzada para psicólogos y terapeutas cognitivos',
      'Plantillas personalizadas de contratiempos de alta presión',
      'Métricas comparativas agregadas de estilo explicativo',
      'Onboarding personalizado y soporte VIP dedicado'
    ],
    ctaText: 'Obtener Executive / Coach',
    popular: false
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Dra. Elena Vasconcelos',
    role: 'Psicóloga Cognitivo-Conductual',
    institution: 'Centro de Terapia Breve, Madrid',
    avatar: 'https://images.unsplash.com/photo-1594824813589-3dcd48f6c6d0?auto=format&fit=crop&q=80&w=150',
    quote: 'OptiMind es la primera herramienta digital que respeta la ciencia de Martin Seligman sin caer en el positivismo ingenuo. Mis pacientes reducen episodios de rumiación en un 45% durante las primeras 3 semanas.',
    metric: '-45% en rumiación'
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    role: 'Director de Producto & Emprendedor',
    institution: 'Fintech Scaleup',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    quote: 'En momentos de alta incertidumbre y fallos de proyecto, la Carta de Descatastrofización y la Matriz de Costo de Fracaso me dan claridad quirúrgica. Es mi gimnasio mental diario.',
    metric: '9.2/10 claridad mental'
  },
  {
    id: 3,
    name: 'Valeria Rivas',
    role: 'Investigadora en Neurociencias',
    institution: 'Instituto de Salud Cognitiva',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    quote: 'La estética Japandi y el sonido de lluvia generan un estado parasimpático inmediato. La experiencia de usuario no genera fricción ni ansiedad.',
    metric: '38 días de racha'
  }
];

export const FAQS = [
  {
    question: '¿En qué se diferencia del "pensamiento positivo" tradicional?',
    answer: 'El pensamiento positivo suele consistir en afirmaciones no comprobadas ("todo saldrá genial"). El Optimismo Aprendido de Martin Seligman es una habilidad cognitiva basada en la precisión y la evidencia: aprender a disputar pensamientos pesimistas automáticos con datos objetivos verificables y explicaciones modificables.'
  },
  {
    question: '¿Mis pensamientos y datos privados están seguros?',
    answer: 'Absolutamente. Tus contratiempos, creencias y registros emocionales se procesan bajo reglas de acceso de base de datos Zero-Trust en Google Cloud Firestore. Nadie más tiene acceso a tus documentos y puedes exportar o eliminar todo tu historial en cualquier momento.'
  },
  {
    question: '¿Puedo cancelar o cambiar mi suscripción cuando lo desee?',
    answer: 'Sí. No existen contratos forzosos. Puedes cambiar de plan, pausar o cancelar tu suscripción con un solo clic desde tu Panel de Usuario. Mantendrás acceso a tus registros sin interrupciones.'
  },
  {
    question: '¿Funciona como complemento a mi terapia psicológica?',
    answer: 'Sí, OptiMind está inspirado en el protocolo ABCDE de la Terapia Racional Emotiva Conductual (TREC) y la Terapia Cognitiva de Aaron Beck adaptada por Seligman. Muchos terapeutas utilizan el Informe Clínico descargable como tarea entre sesiones.'
  },
  {
    question: '¿Qué sucede si utilizo la app sin conexión a internet?',
    answer: 'OptiMind cuenta con arquitectura local-first. Todo lo que registres se guarda localmente y, en cuanto detecta conexión, se sincroniza de manera transparente con tu cuenta de Cloud Firestore.'
  },
  {
    question: '¿Ofrecen garantía de reembolso?',
    answer: 'Ofrecemos una garantía de serenidad de 30 días sin preguntas en todos los planes de pago. Si sientes que la herramienta no ha aportado calma y claridad a tu mente, te reembolsamos el 100% de inmediato.'
  }
];
