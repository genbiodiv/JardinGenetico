import { Phase } from "./types";

export const PAUSE_THRESHOLD = 50;

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
    hue: { start: number; end: number };
    saturation: { start: number; end: number };
    lightness: { start: number; end: number };
  };
  pattern?: 'dots' | 'none';
  shapes: {
    minRadius: string;
    maxRadius: string;
    midRadius: string;
    type: 'round' | 'star' | 'heart' | 'sharp' | 'leaf' | 'needle';
  };
}

export const FLOWER_THEMES: FlowerTheme[] = [
  {
    id: 'poppy',
    name: { en: 'Rainbow Blooms', es: 'Flores Arcoíris' },
    description: { 
      en: 'A full spectrum of colors from red to violet.', 
      es: 'Un espectro completo de colores desde el rojo al violeta.' 
    },
    colors: { 
      hue: { start: 0, end: 300 }, 
      saturation: { start: 90, end: 95 }, 
      lightness: { start: 50, end: 55 } 
    },
    pattern: 'dots',
    shapes: { minRadius: '50%', maxRadius: '20%', midRadius: '40%', type: 'star' }
  },
  {
    id: 'sunflower',
    name: { en: 'Celestial Blooms', es: 'Flores Celestiales' },
    description: { 
      en: 'Deep blues transitioning to bright yellows.', 
      es: 'Azules profundos en transición a amarillos brillantes.' 
    },
    colors: { 
      hue: { start: 220, end: 60 }, 
      saturation: { start: 90, end: 100 }, 
      lightness: { start: 40, end: 60 } 
    },
    shapes: { minRadius: '30%', maxRadius: '0%', midRadius: '15%', type: 'heart' }
  },
  {
    id: 'lily',
    name: { en: 'Sunset Lilies', es: 'Lirios del Atardecer' },
    description: { 
      en: 'Green to orange with a golden yellow center.', 
      es: 'Verde a naranja con un centro amarillo dorado.' 
    },
    colors: { 
      hue: { start: 140, end: 30 }, 
      saturation: { start: 80, end: 90 }, 
      lightness: { start: 40, end: 55 } 
    },
    shapes: { minRadius: '10%', maxRadius: '45%', midRadius: '25%', type: 'leaf' }
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
  credits: string;
  howToPlay: { title: string; steps: string[] };
  phases: { title: string; list: { name: string; objective: string }[] };
  concepts: { title: string; list: { name: string; desc: string }[] };
  controls: {
    title: string;
    items: { name: string; desc: string }[];
  };
  challenges: {
    title: string;
    list: { task: string; location: string }[];
  };
}> = {
  en: {
    intro: "Welcome to Genetic Garden, a living laboratory where you explore the fundamental principles of genetics and evolution through the breeding of digital flowers.",
    credits: "Developed for the biology course by Rafik Neme at Universidad del Norte using Google AI Studio. This simulation uses a polygenic inheritance model with additive effects and Mendelian principles.",
    howToPlay: {
      title: "How to Play",
      steps: [
        "Observe the initial population of flowers in your garden.",
        "Use the 'Start Seasons' button to let the population evolve naturally through random mating.",
        "Select TWO flowers to experiment on. Once two are selected, the 'Genetic Gardener' panel will open.",
        "In the Gardener panel, you can manually edit genes to see how they affect the phenotype (appearance).",
        "Perform a controlled cross between your selected flowers to repopulate the garden with their offspring.",
        "Download your simulation data at any time using the download button.",
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
    concepts: {
      title: "Core Concepts",
      list: [
        { name: "Population Size", desc: "The total number of individuals in a breeding group. Smaller populations are more susceptible to genetic drift, where random sampling of alleles can lead to the loss or fixation of genetic variants regardless of their adaptive value." },
        { name: "Mutation Rate", desc: "The probability that an allele will change its state (from 0 to 1 or vice versa) during DNA replication. It is the fundamental source of new genetic variation, introducing novel alleles into the gene pool upon which selection can act." },
        { name: "Selection Intensity", desc: "The degree of differential reproductive success based on phenotype. High intensity means individuals with traits closer to the environmental optimum have a significantly higher probability of contributing to the next generation's gene pool." },
        { name: "Number of Genes", desc: "The count of independent genetic loci that contribute to a specific phenotypic trait. Increasing the number of genes involved in a trait leads to a transition from discrete Mendelian variation to continuous polygenic variation." },
        { name: "Dominance & Recessiveness", desc: "A pattern of inheritance where one allele (dominant) masks the phenotypic expression of another allele (recessive) at the same locus when both are present in a heterozygous individual." },
        { name: "Incomplete Dominance", desc: "A genetic interaction where neither allele is completely dominant over the other, resulting in a heterozygous phenotype that is an intermediate blend of the two homozygous phenotypes." },
        { name: "Mendelian vs. Polygenic", desc: "Mendelian traits are controlled by a single locus and show discrete variation. Polygenic traits are controlled by multiple loci, often resulting in a continuous distribution of phenotypes that follows a normal distribution (bell curve)." },
        { name: "Genetic Variation", desc: "The presence of multiple alleles at different loci within a population. It is measured by the frequency of different genotypes and provides the necessary substrate for evolutionary processes like selection and drift." },
        { name: "Gene Editing", desc: "The targeted modification of specific alleles within an individual's genotype. This allows for the direct observation of how specific genetic changes alter the resulting phenotype without the need for multiple generations of breeding." },
        { name: "Crosses", desc: "Controlled breeding experiments between two individuals with known genotypes or phenotypes to study the inheritance patterns of specific traits in their offspring." },
        { name: "Genetic Drift", desc: "A stochastic process where allele frequencies in a population change over time due to random sampling of gametes in each generation. Its effect is inversely proportional to the effective population size." },
        { name: "Genotype vs. Phenotype", desc: "The genotype is the specific set of alleles an individual carries (represented here as binary sequences). The phenotype is the observable physical or biochemical expression of that genotype, influenced by the inheritance model." }
      ]
    },
    controls: {
      title: "Garden Controls",
      items: [
        { name: "Mutation Rate", desc: "Controls how often random genetic errors occur during reproduction." },
        { name: "Time between Generations", desc: "Determines the duration of each breeding cycle in the simulation." },
        { name: "Selection Strength", desc: "In Phase 5, determines how strictly the environment favors the 'Target Color'." },
        { name: "Layout Modes", desc: "Switch between Grid, Frequency (sorted by trait), and Color views to analyze your population." }
      ]
    },
    challenges: {
      title: "Learning Challenges",
      list: [
        { task: "Observe how genetic drift affects allele frequencies in small (20) vs. large (100) populations.", location: "Phase 5, Garden Management" },
        { task: "Use the Genetic Gardener to manually edit genes and match a specific target color exactly.", location: "Any Phase, Genetic Gardener panel" },
        { task: "Compare the phenotype distribution (histogram) when using 4 genes vs. 20 genes. How does the 'smoothness' change?", location: "Phase 3 vs. Phase 4, Visualizations" },
        { task: "Set a high Selection Strength and observe how quickly the population shifts towards the Target Color.", location: "Phase 5, Garden Management" },
        { task: "Set a high Mutation Rate (20%) and observe if the population can ever stabilize on a single color.", location: "Any Phase, Garden Management" }
      ]
    }
  },
  es: {
    intro: "Bienvenido a Jardín Genético, un laboratorio viviente donde exploras los principios fundamentales de la genética y la evolución a través de la cría de flores digitales.",
    credits: "Desarrollado para el curso de biología por Rafik Neme en la Universidad del Norte usando Google AI Studio. Esta simulación utiliza un modelo de herencia poligénica con efectos aditivos y principios mendelianos.",
    howToPlay: {
      title: "Cómo Jugar",
      steps: [
        "Observa la población inicial de flores en tu jardín.",
        "Usa el botón 'Iniciar Estaciones' para dejar que la población evolucione naturalmente mediante el apareamiento aleatorio.",
        "Selecciona DOS flores para experimentar. Una vez seleccionadas dos, se abrirá el panel de 'Jardinero Genético'.",
        "En el panel de Jardinero, puedes editar genes manualmente para ver cómo afectan al fenotipo (apariencia).",
        "Realiza un cruce controlado entre las flores seleccionadas para repoblar el jardín con su descendencia.",
        "Descarga los datos de tu simulación en cualquier momento usando el botón de descarga.",
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
    concepts: {
      title: "Conceptos Clave",
      list: [
        { name: "Tamaño de Población", desc: "El número total de individuos en un grupo de cría. Las poblaciones pequeñas son más susceptibles a la deriva genética, donde el muestreo aleatorio de alelos puede llevar a la pérdida o fijación de variantes genéticas independientemente de su valor adaptativo." },
        { name: "Tasa de Mutación", desc: "La probabilidad de que un alelo cambie su estado (de 0 a 1 o viceversa) durante la replicación del ADN. Es la fuente fundamental de nueva variación genética, introduciendo alelos novedosos en el acervo génico sobre los cuales puede actuar la selección." },
        { name: "Intensidad de Selección", desc: "El grado de éxito reproductivo diferencial basado en el fenotipo. Una intensidad alta significa que los individuos con rasgos más cercanos al óptimo ambiental tienen una probabilidad significativamente mayor de contribuir al acervo génico de la siguiente generación." },
        { name: "Número de Genes", desc: "La cantidad de loci genéticos independientes que contribuyen a un rasgo fenotípico específico. Aumentar el número de genes involucrados en un rasgo conduce a una transición de la variación mendeliana discreta a la variación poligénica continua." },
        { name: "Dominancia y Recesividad", desc: "Un patrón de herencia donde un alelo (dominante) enmascara la expresión fenotípica de otro alelo (recesivo) en el mismo locus cuando ambos están presentes en un individuo heterocigoto." },
        { name: "Dominancia Incompleta", desc: "Una interacción genética donde ningún alelo es completamente dominante sobre el otro, resultando en un fenotipo heterocigoto que es una mezcla intermedia de los dos fenotipos homocigotos." },
        { name: "Mendeliano vs. Poligénico", desc: "Los rasgos mendelianos están controlados por un solo locus y muestran una variación discreta. Los rasgos poligénicos están controlados por múltiples loci, lo que a menudo resulta en una distribución continua de fenotipos que sigue una distribución normal (curva de campana)." },
        { name: "Variación Genética", desc: "La presencia de múltiples alelos en diferentes loci dentro de una población. Se mide por la frecuencia de diferentes genotipos y proporciona el sustrato necesario para procesos evolutivos como la selección y la deriva." },
        { name: "Edición Génica", desc: "La modificación dirigida de alelos específicos dentro del genotipo de un individuo. Esto permite la observación directa de cómo cambios genéticos específicos alteran el fenotipo resultante sin necesidad de múltiples generaciones de cría." },
        { name: "Cruces", desc: "Experimentos de cría controlada entre dos individuos con genotipos o fenotipos conocidos para estudiar los patrones de herencia de rasgos específicos en su descendencia." },
        { name: "Deriva Genética", desc: "Un proceso estocástico donde las frecuencias alélicas en una población cambian con el tiempo debido al muestreo aleatorio de gametos en cada generación. Su efecto es inversamente proporcional al tamaño efectivo de la población." },
        { name: "Genotipo vs. Fenotipo", desc: "El genotipo es el conjunto específico de alelos que porta un individuo (representado aquí como secuencias binarias). El fenotipo es la expresión física o bioquímica observable de ese genotipo, influenciada por el modelo de herencia." }
      ]
    },
    controls: {
      title: "Controles del Jardín",
      items: [
        { name: "Tasa de Mutación", desc: "Controla con qué frecuencia ocurren errores genéticos aleatorios durante la reproducción." },
        { name: "Tiempo entre Generaciones", desc: "Determina la duración de cada ciclo de cría en la simulación." },
        { name: "Fuerza de Selección", desc: "En la Fase 5, determina qué tan estrictamente el ambiente favorece el 'Color Objetivo'." },
        { name: "Modos de Diseño", desc: "Cambia entre las vistas de Cuadrícula, Frecuencia (ordenada por rasgo) y Color para analizar tu población." }
      ]
    },
    challenges: {
      title: "Desafíos de Aprendizaje",
      list: [
        { task: "Observa cómo la deriva genética afecta las frecuencias alélicas en poblaciones pequeñas (20) frente a grandes (100).", location: "Fase 5, Gestión del Jardín" },
        { task: "Usa el Jardinero Genético para editar genes manualmente y coincidir exactamente con un color objetivo específico.", location: "Cualquier Fase, panel del Jardinero Genético" },
        { task: "Compara la distribución del fenotipo (histograma) cuando usas 4 genes frente a 20 genes. ¿Cómo cambia la 'suavidad'?", location: "Fase 3 vs. Fase 4, Visualizaciones" },
        { task: "Establece una Fuerza de Selección alta y observa qué tan rápido la población se desplaza hacia el Color Objetivo.", location: "Fase 5, Gestión del Jardín" },
        { task: "Establece una Tasa de Mutación alta (20%) y observa si la población puede estabilizarse alguna vez en un solo color.", location: "Cualquier Fase, Gestión del Jardín" }
      ]
    }
  }
};
