import { Phase } from "./types";

export type Localized<T = string> = {
  en: T;
  es: T;
};

export interface PhaseContent {
  title: Localized;
  subtitle: Localized;
  description: Localized;
  conceptName?: Localized;
  conceptSummary?: Localized;
}

export interface FlowerTheme {
  id: string;
  name: Localized;
  description: Localized;
  colors: {
    start: number; // Hue
    end: number;   // Hue
    saturation: number;
    lightness: number;
  };
  shapes: {
    minRadius: string;
    maxRadius: string;
    midRadius: string;
  };
}

export const FLOWER_THEMES: FlowerTheme[] = [
  {
    id: 'marigold',
    name: { en: 'Sun-Kissed Marigolds', es: 'Caléndulas del Sol' },
    description: { 
      en: 'Vibrant yellows and deep reds. Round to star-like petals.', 
      es: 'Amarillos vibrantes y rojos profundos. Pétalos redondos a puntiagudos.' 
    },
    colors: { start: 60, end: 0, saturation: 100, lightness: 50 },
    shapes: { minRadius: '50%', maxRadius: '20%', midRadius: '40%' }
  },
  {
    id: 'orchid',
    name: { en: 'Midnight Orchids', es: 'Orquídeas de Medianoche' },
    description: { 
      en: 'Cool blues to mysterious purples. Heart-shaped to sharp petals.', 
      es: 'Azules fríos a púrpuras misteriosos. Pétalos de corazón a afilados.' 
    },
    // Increased hue range for higher contrast: 210 (Blue) to 310 (Magenta)
    colors: { start: 210, end: 310, saturation: 90, lightness: 55 },
    shapes: { minRadius: '30%', maxRadius: '0%', midRadius: '15%' }
  },
  {
    id: 'fern',
    name: { en: 'Emerald Ferns', es: 'Helechos Esmeralda' },
    description: { 
      en: 'Fresh lime to deep forest greens. Broad leaves to needle-like fronds.', 
      es: 'Lima fresca a verdes de bosque profundo. Hojas anchas a frondas de aguja.' 
    },
    // Increased hue range for higher contrast: 70 (lime) to 160 (green-teal)
    colors: { start: 70, end: 160, saturation: 80, lightness: 40 },
    shapes: { minRadius: '10%', maxRadius: '45%', midRadius: '25%' }
  }
];

export const PHASE_DATA: Record<Phase, PhaseContent> = {
  [Phase.MENDELIAN_SIMPLICITY]: {
    title: { en: "Phase 1", es: "Fase 1" },
    subtitle: { en: "Mendelian Inheritance", es: "Herencia Mendeliana" },
    description: { 
      en: "Single gene inheritance with discrete traits. Alleles are either dominant or recessive, resulting in clear, non-blending phenotypes.", 
      es: "Herencia de un solo gen con rasgos discretos. Los alelos son dominantes o recesivos, resultando en fenotipos claros y sin mezcla." 
    },
    conceptName: { en: "Mendelian Inheritance", es: "Herencia Mendeliana" },
    conceptSummary: { 
      en: "Discrete traits controlled by single genes. Like a switch, the trait is either 'on' or 'off'.", 
      es: "Rasgos discretos controlados por genes individuales. Como un interruptor, el rasgo está 'encendido' o 'apagado'." 
    }
  },
  [Phase.FRAGILE_MENDELIAN]: {
    title: { en: "Phase 2", es: "Fase 2" },
    subtitle: { en: "Incomplete Dominance", es: "Dominancia Incompleta" },
    description: { 
      en: "Alleles blend their effects, creating an intermediate phenotype. Heterozygous individuals show a mix of both parental traits.", 
      es: "Los alelos mezclan sus efectos, creando un fenotipo intermedio. Los individuos heterocigotos muestran una mezcla de ambos rasgos parentales." 
    },
    conceptName: { en: "Incomplete Dominance", es: "Dominancia Incompleta" },
    conceptSummary: { 
      en: "When alleles blend their effects, creating an intermediate phenotype like Pink from Red and White parents.", 
      es: "Cuando los alelos mezclan sus efectos, creando un fenotipo intermedio como el rosa de padres rojos y blancos." 
    }
  },
  [Phase.MULTI_GENE]: {
    title: { en: "Phase 3", es: "Fase 3" },
    subtitle: { en: "Additive Variation", es: "Variación Aditiva" },
    description: { 
      en: "Multiple genes contribute to a single trait. Each gene adds a small amount of variation, creating a discrete spectrum of shades.", 
      es: "Múltiples genes contribuyen a un solo rasgo. Cada gen añade una pequeña cantidad de variación, creando un espectro discreto de tonos." 
    },
    conceptName: { en: "Additive Variation", es: "Variación Aditiva" },
    conceptSummary: { 
      en: "When multiple genes each contribute a small amount of 'pigment' to the final flower color.", 
      es: "Cuando múltiples genes contribuyen cada uno con una pequeña cantidad de 'pigmento' al color final de la flor." 
    }
  },
  [Phase.FULLY_POLYGENIC]: {
    title: { en: "Phase 4", es: "Fase 4" },
    subtitle: { en: "Polygenic Inheritance", es: "Herencia Poligénica" },
    description: { 
      en: "Dozens of genes work in concert to define the trait. The resulting variation is nearly continuous, forming a smooth bell curve.", 
      es: "Docenas de genes trabajan en concierto para definir el rasgo. La variación resultante es casi continua, formando una curva de campana suave." 
    },
    conceptName: { en: "Polygenic Inheritance", es: "Herencia Poligénica" },
    conceptSummary: { 
      en: "Most complex traits in nature are the result of hundreds of genes working in concert.", 
      es: "La mayoría de los rasgos complejos en la naturaleza son el resultado de cientos de genes trabajando en concierto." 
    }
  },
  [Phase.SELECTION_DRIFT]: {
    title: { en: "Phase 5", es: "Fase 5" },
    subtitle: { en: "Selection vs. Drift", es: "Selección vs. Deriva" },
    description: { 
      en: "The interplay between random sampling (Drift) and environmental pressure (Selection). Population size determines which force dominates.", 
      es: "La interacción entre el muestreo aleatorio (Deriva) y la presión ambiental (Selección). El tamaño de la población determina qué fuerza domina." 
    },
    conceptName: { en: "Genetic Drift vs. Natural Selection", es: "Deriva Genética vs. Selección Natural" },
    conceptSummary: { 
      en: "Evolution is the dance between the random luck of the draw and the pressure of the environment.", 
      es: "La evolución es la danza entre la suerte aleatoria del sorteo y la presión del entorno." 
    }
  }
};

export const GAMEPLAY_GUIDE: Localized<{
  intro: string;
  howToPlay: { title: string; steps: string[] };
  phases: { title: string; list: { name: string; objective: string }[] };
  controls: { title: string; items: { name: string; desc: string }[] };
}> = {
  en: {
    intro: "Welcome to Genetica Garden, a living laboratory where you explore the fundamental principles of genetics and evolution through the breeding of digital flowers.",
    howToPlay: {
      title: "How to Play",
      steps: [
        "Observe the initial population of flowers in your garden.",
        "Use the 'Start Seasons' button to let the population evolve naturally through random mating.",
        "Click on individual flowers to inspect their 'Genetic Architecture' (genotype) and 'Phenotypic Traits' (appearance).",
        "In 'Gardener Mode' (when a flower is selected), you can manually edit genes to see how they affect the phenotype.",
        "Select a second flower as a 'Breeding Partner' to perform a controlled cross and repopulate the garden with their offspring.",
        "Monitor the 'Analysis Progress' bar. Once it reaches 100%, you've gathered enough data to understand the current genetic mechanism.",
        "Advance to the next Season to unlock more complex genetic behaviors."
      ]
    },
    phases: {
      title: "Simulation Phases",
      list: [
        { name: "Phase 1: Mendelian Simplicity", objective: "Understand discrete inheritance where traits are either dominant or recessive." },
        { name: "Phase 2: Fragile Mendelian", objective: "Explore incomplete dominance where alleles blend to create intermediate colors." },
        { name: "Phase 3: Multi-Gene", objective: "Observe how a small number of genes (4) create a discrete spectrum of variation." },
        { name: "Phase 4: Fully Polygenic", objective: "Experience continuous variation where dozens of genes create a smooth bell curve of traits." },
        { name: "Phase 5: Selection vs. Drift", objective: "Master the interplay between random luck (drift) and environmental pressure (selection)." }
      ]
    },
    controls: {
      title: "Garden Controls",
      items: [
        { name: "Mutation Rate", desc: "Controls how often random genetic errors occur during reproduction." },
        { name: "Selection Strength", desc: "In Phase 5, determines how strictly the environment favors the 'Target Color'." },
        { name: "Layout Modes", desc: "Switch between Grid, Frequency (sorted by trait), and Color views to analyze your population." }
      ]
    }
  },
  es: {
    intro: "Bienvenido a Genetica Garden, un laboratorio viviente donde exploras los principios fundamentales de la genética y la evolución a través de la cría de flores digitales.",
    howToPlay: {
      title: "Cómo Jugar",
      steps: [
        "Observa la población inicial de flores en tu jardín.",
        "Usa el botón 'Iniciar Estaciones' para dejar que la población evolucione naturalmente mediante el apareamiento aleatorio.",
        "Haz clic en flores individuales para inspeccionar su 'Arquitectura Genética' (genotipo) y 'Rasgos Fenotípicos' (apariencia).",
        "En el 'Modo Jardinero' (cuando se selecciona una flor), puedes editar genes manualmente para ver cómo afectan al fenotipo.",
        "Selecciona una segunda flor como 'Compañero de Cría' para realizar un cruce controlado y repoblar el jardín con su descendencia.",
        "Monitorea la barra de 'Progreso del Análisis'. Una vez que llega al 100%, habrás reunido suficientes datos para comprender el mecanismo genético actual.",
        "Avanza a la siguiente Estación para desbloquear comportamientos genéticos más complejos."
      ]
    },
    phases: {
      title: "Fases de la Simulación",
      list: [
        { name: "Fase 1: Simplicidad Mendeliana", objective: "Comprender la herencia discreta donde los rasgos son dominantes o recesivos." },
        { name: "Fase 2: Mendeliana Frágil", objective: "Explorar la dominancia incompleta donde los alelos se mezclan para crear colores intermedios." },
        { name: "Fase 3: Multi-Gen", objective: "Observar cómo un pequeño número de genes (4) crea un espectro discreto de variación." },
        { name: "Fase 4: Completamente Poligénica", objective: "Experimentar la variación continua donde docenas de genes crean una curva de campana suave de rasgos." },
        { name: "Fase 5: Selección vs. Deriva", objective: "Dominar la interacción entre la suerte aleatoria (deriva) y la presión ambiental (selección)." }
      ]
    },
    controls: {
      title: "Controles del Jardín",
      items: [
        { name: "Tasa de Mutación", desc: "Controla con qué frecuencia ocurren errores genéticos aleatorios durante la reproducción." },
        { name: "Fuerza de Selección", desc: "En la Fase 5, determina qué tan estrictamente el ambiente favorece el 'Color Objetivo'." },
        { name: "Modos de Diseño", desc: "Cambia entre las vistas de Cuadrícula, Frecuencia (ordenada por rasgo) y Color para analizar tu población." }
      ]
    }
  }
};
