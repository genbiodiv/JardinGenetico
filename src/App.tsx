import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flower, 
  Users, 
  Zap, 
  Dna,
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause,
  Info,
  Edit3,
  ChevronRight,
  TrendingUp,
  Wind,
  Timer,
  Sprout,
  Sun,
  BookOpen,
  Download,
  Trophy,
  RefreshCw,
  Layout,
  X
} from 'lucide-react';
import { Phase, Organism } from './types';
import * as d3 from 'd3';
import { createInitialPopulation, reproduce, calculatePhenotype } from './engine';
import { Histogram } from './components/Histogram';
import { PopulationGrid } from './components/PopulationGrid';
import { PhenotypeHistoryChart } from './components/PhenotypeHistoryChart';
import { OrganismDetailPanel } from './components/OrganismDetailPanel';
import { GameplayGuide } from './components/GameplayGuide';
import { PHASE_DATA, FLOWER_THEMES, FlowerTheme, PAUSE_THRESHOLD, DOWNLOAD_THRESHOLD, GAMEPLAY_GUIDE } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es'>('es');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [flowerTheme, setFlowerTheme] = useState<FlowerTheme>(FLOWER_THEMES[0]);
  const [phase, setPhase] = useState<Phase>(Phase.MENDELIAN_SIMPLICITY);
  const [population, setPopulation] = useState<Organism[]>([]);
  const [generation, setGeneration] = useState(0);
  const [mutationRate, setMutationRate] = useState(0.01);
  const [populationSize, setPopulationSize] = useState(20);
  const [generationInterval, setGenerationInterval] = useState(500);
  const [selectionStrength, setSelectionStrength] = useState(0.5);
  const [selectionTarget, setSelectionTarget] = useState(0.5);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'concentric' | 'color'>('concentric');
  const [numGenes, setNumGenes] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConcept, setShowConcept] = useState(false);
  const [discoveryProgress, setDiscoveryProgress] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [breedingPartner, setBreedingPartner] = useState<Organism | null>(null);
  const [showGameplay, setShowGameplay] = useState(false);
  const [levelHistory, setLevelHistory] = useState<Record<number, { phase: Phase; generation: number; population: Organism[] }>>({});
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);

  // Fix body scroll when splash or detail panel is visible
  useEffect(() => {
    if (isSplashVisible || selectedOrganism || showGameplay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSplashVisible, selectedOrganism, showGameplay]);

  const currentPhaseData = PHASE_DATA[phase];

  const getHistoryPoint = useCallback((pop: Organism[], gen: number) => {
    const binCount = phase >= Phase.MULTI_GENE ? 20 : 5;
    const binGenerator = d3.bin()
      .domain([0, 1])
      .thresholds(binCount);
    
    const binnedData = binGenerator(pop.map(org => org.phenotype));
    
    const bins: Record<string, number> = {};
    binnedData.forEach((bin, i) => {
      bins[`B${i}`] = bin.length;
    });
    
    return { generation: gen, ...bins };
  }, [phase]);

  // Sync numGenes with phase
  useEffect(() => {
    if (phase === Phase.MENDELIAN_SIMPLICITY || phase === Phase.FRAGILE_MENDELIAN) {
      setNumGenes(1);
    } else if (phase === Phase.MULTI_GENE) {
      setNumGenes(4);
    } else if (phase >= Phase.FULLY_POLYGENIC) {
      setNumGenes(20);
    }
  }, [phase]);

  // Initialize population on phase change, theme change, or numGenes change
  useEffect(() => {
    const initialPop = createInitialPopulation(populationSize, numGenes, phase);
    setPopulation(initialPop);
    setGeneration(0);
    setDiscoveryProgress(0);
    setShowConcept(false);
    setHistory([getHistoryPoint(initialPop, 0)]);
  }, [phase, populationSize, getHistoryPoint, flowerTheme, numGenes]);

  const runGeneration = useCallback(() => {
    if (generation >= PAUSE_THRESHOLD) {
      setIsPlaying(false);
      return;
    }

    setPopulation(prev => {
      const nextPop: Organism[] = [];
      
      // Selection logic (Phase 6)
      if (phase === Phase.SELECTION_DRIFT) {
        // Calculate fitness for all based on selectionTarget
        const populationWithFitness = prev.map(org => {
          const dist = Math.abs(org.phenotype - selectionTarget);
          // Fitness is higher for those closer to target
          // selectionStrength 0 -> fitness 1 for all (pure drift)
          // selectionStrength 1 -> fitness varies significantly
          // Use a steeper fitness curve to make selection more effective
          const fitness = Math.exp(-Math.pow(dist, 1.5) * 12 * selectionStrength); 
          return { org, fitness };
        });

        // Sort by fitness for elitism
        populationWithFitness.sort((a, b) => b.fitness - a.fitness);

        const totalFitness = populationWithFitness.reduce((sum, p) => sum + p.fitness, 0);
        
        for (let i = 0; i < populationSize; i++) {
          // Elitism: Keep the top 5% of the population exactly as is (no mutation in reproduction for them)
          if (i < Math.max(1, Math.floor(populationSize * 0.05))) {
            nextPop.push({ ...populationWithFitness[i].org, id: Math.random().toString(36).substr(2, 9) });
            continue;
          }

          const pickParent = () => {
            let r = Math.random() * totalFitness;
            for (const p of populationWithFitness) {
              r -= p.fitness;
              if (r <= 0) return p.org;
            }
            return populationWithFitness[0].org;
          };
          
          const p1 = pickParent();
          const p2 = pickParent();
          
          nextPop.push(reproduce(p1, p2, mutationRate, phase));
        }
      } else {
        // Standard random mating
        for (let i = 0; i < populationSize; i++) {
          const p1 = prev[Math.floor(Math.random() * prev.length)];
          const p2 = prev[Math.floor(Math.random() * prev.length)];
          nextPop.push(reproduce(p1, p2, mutationRate, phase));
        }
      }
      
      return nextPop;
    });
    setGeneration(g => g + 1);
    setDiscoveryProgress(p => Math.min(100, p + 20));
  }, [populationSize, mutationRate, phase, selectionStrength, selectionTarget]);

  // Separate history tracking to avoid stale closures and side effects in setPopulation
  useEffect(() => {
    if (population.length === 0) return;
    setHistory(h => {
      // Only add if this generation isn't already the last point
      if (h.length > 0 && h[h.length - 1].generation === generation) return h;
      const point = getHistoryPoint(population, generation);
      const newHistory = [...h, point];
      return newHistory.slice(-50);
    });
  }, [population, generation, getHistoryPoint]);

  useEffect(() => {
    let interval: any;
    // Pause simulation if an organism is selected (Genetic Gardener mode)
    if (isPlaying && !selectedOrganism) {
      interval = setInterval(runGeneration, generationInterval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, runGeneration, generationInterval, selectedOrganism]);

  const nextPhase = () => {
    // Save current level to history
    setLevelHistory(prev => ({
      ...prev,
      [phase]: { phase, generation, population }
    }));

    if (phase < Phase.SELECTION_DRIFT) {
      setPhase(p => p + 1);
    } else {
      setIsGameFinished(true);
    }
  };

  const downloadData = () => {
    if (generation < DOWNLOAD_THRESHOLD) {
      alert(language === 'en' 
        ? `You must reach at least ${DOWNLOAD_THRESHOLD} generations to download data.` 
        : `Debes alcanzar al menos ${DOWNLOAD_THRESHOLD} generaciones para descargar datos.`);
      return;
    }

    const lastHistoryPoint = history[history.length - 1];
    const binKeys = Object.keys(lastHistoryPoint).filter(k => k.startsWith('B'));
    const totalPop = population.length;

    const csvRows = [];
    // Header
    csvRows.push(['Color_HEX', 'Frequency_Fraction', 'Generation'].join(','));

    binKeys.forEach(key => {
      const binIdx = parseInt(key.substring(1));
      const binCount = binKeys.length;
      const phenotype = (binIdx + 0.5) / binCount;
      
      const { colors } = flowerTheme;
      const hue = colors.hue.start + (colors.hue.end - colors.hue.start) * phenotype;
      const saturation = colors.saturation.start + (colors.saturation.end - colors.saturation.start) * phenotype;
      const lightness = colors.lightness.start + (colors.lightness.end - colors.lightness.start) * phenotype;
      const colorHsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const colorHex = d3.color(colorHsl)?.formatHex() || '#000000';
      
      const count = lastHistoryPoint[key];
      const fraction = count / totalPop;
      
      csvRows.push([colorHex, fraction.toFixed(4), generation].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetic_garden_data_gen${generation}_${Date.now()}.csv`;
    a.click();
  };

  const downloadAllData = () => {
    if (Object.keys(levelHistory).length === 0) return;
    
    const csvRows = [];
    csvRows.push(['Phase', 'Generations', 'Final_Population_Size'].join(','));
    
    Object.values(levelHistory).forEach((h: any) => {
      csvRows.push([
        PHASE_DATA[h.phase as Phase].subtitle[language],
        h.generation,
        h.population.length
      ].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genetic_garden_summary_${Date.now()}.csv`;
    a.click();
  };

  const resetGame = () => {
    setPhase(Phase.MENDELIAN_SIMPLICITY);
    setLevelHistory({});
    setIsGameFinished(false);
    setIsSplashVisible(true);
  };

  const restartLevel = (levelPhase?: Phase) => {
    if (levelPhase !== undefined) {
      setPhase(levelPhase);
      setIsGameFinished(false);
    }
    resetPopulation();
  };

  const resetPopulation = () => {
    let numGenes = 1;
    if (phase === Phase.MULTI_GENE) numGenes = 4;
    else if (phase >= Phase.FULLY_POLYGENIC) numGenes = 20;
    
    const initialPop = createInitialPopulation(populationSize, numGenes, phase);
    setPopulation(initialPop);
    setGeneration(0);
    setDiscoveryProgress(0);
    setHistory([getHistoryPoint(initialPop, 0)]);
  };

  const openGardener = () => {
    if (!selectedOrganism && population.length >= 2) {
      setSelectedOrganism(population[0]);
      setBreedingPartner(population[1]);
    }
  };

  const phenotypeData = useMemo(() => population.map(p => p.phenotype), [population]);

  const t = useMemo(() => ({
    en: {
      tagline: "A simulation of genetic inheritance, population dynamics, and evolutionary selection.",
      selectSpecies: "Select Your Species",
      startGardening: "Start Gardening",
      seeGameplay: "Game Guide",
      genes: "Genes",
      currentPhase: "Current Phase",
      generation: "Generation",
      management: "Garden Management",
      mutationRate: "Mutation Rate",
      gardenSize: "Garden Size",
      bloomSpeed: "Time between Generations",
      targetColor: "Target Color",
      selectionStrength: "Selection Strength",
      driftDesc: "Pure Genetic Drift: Luck determines survival.",
      selectionDesc: "Strong Selection: Only the fittest survive.",
      balancedDesc: "Balanced: Both luck and fitness matter.",
      stopSeasons: "Stop Seasons",
      startSeasons: "Start Seasons",
      nextGen: "Next Generation",
      replant: "Replant Garden",
      layoutRandom: "Random",
      layoutFreq: "Frequency",
      layoutColor: "Color",
      advance: "Advance to Next Season",
      health: "Garden Health: Optimal",
      garden: "Garden",
      flowers: "Flowers",
      mutation: "Mutation",
      restart: "Restart Garden",
      restartLevel: "Restart Level",
      downloadData: "Download Data",
      gameSummary: "Game Summary",
      congratulations: "Congratulations!",
      gameCompleteDesc: "You have completed all phases of the Genetic Garden.",
      downloadAll: "Download All",
      playAgain: "Play Again",
      level: "Level",
      generations: "Generations",
      paused: "Paused",
      gotIt: "Got it!",
      colorDist: "Flower Color Distribution",
      phenoEvo: "Phenotype Evolution",
      partnerId: "Partner ID",
      total: "total",
      dominantAlleles: "dominant",
      geneticGardener: "Genetic Gardener",
      numGenes: "Number of Genes",
      challenges: "Learning Challenges",
      close: "Close"
    },
    es: {
      tagline: "Una simulación de herencia genética, dinámica de poblaciones y selección evolutiva.",
      selectSpecies: "Selecciona tu Especie",
      startGardening: "Empezar Jardinería",
      seeGameplay: "Guía de Juego",
      genes: "Genes",
      currentPhase: "Fase Actual",
      generation: "Generación",
      management: "Gestión del Jardín",
      mutationRate: "Tasa de Mutación",
      gardenSize: "Tamaño del Jardín",
      bloomSpeed: "Tiempo entre Generaciones",
      targetColor: "Color Objetivo",
      selectionStrength: "Fuerza de Selección",
      driftDesc: "Deriva Genética Pura: La suerte determina la supervivencia.",
      selectionDesc: "Selección Fuerte: Solo los más aptos sobreviven.",
      balancedDesc: "Equilibrado: Tanto la suerte como la aptitud importan.",
      stopSeasons: "Detener avance automático",
      startSeasons: "Avanzar generaciones automático",
      nextGen: "Avanzar generaciones manual",
      replant: "Replantar Jardín",
      layoutRandom: "Aleatorio",
      layoutFreq: "Frecuencia",
      layoutColor: "Color",
      advance: "Siguiente fase",
      health: "Salud del Jardín: Óptima",
      garden: "Jardín",
      flowers: "Flores",
      mutation: "Mutación",
      restart: "Reiniciar Jardín",
      restartLevel: "Reiniciar Nivel",
      downloadData: "Descargar Datos",
      gameSummary: "Resumen del Juego",
      congratulations: "¡Felicitaciones!",
      gameCompleteDesc: "Has completado todas las fases del Jardín Genético.",
      downloadAll: "Descargar Todo",
      playAgain: "Jugar de Nuevo",
      level: "Nivel",
      generations: "Generaciones",
      paused: "Pausado",
      gotIt: "¡Entendido!",
      colorDist: "Distribución del Color de las Flores",
      phenoEvo: "Evolución del Fenotipo",
      partnerId: "ID de Compañero",
      total: "total",
      dominantAlleles: "dominantes",
      geneticGardener: "Jardinero Genético",
      numGenes: "Número de Genes",
      challenges: "Desafíos de Aprendizaje",
      close: "Cerrar"
    }
  }[language]), [language]);

  const handleSelectOrganism = (org: Organism) => {
    if (!selectedOrganism) {
      setSelectedOrganism(org);
    } else if (selectedOrganism.id === org.id) {
      setSelectedOrganism(null);
      setBreedingPartner(null);
    } else if (!breedingPartner) {
      setBreedingPartner(org);
    } else if (breedingPartner.id === org.id) {
      setBreedingPartner(null);
    } else {
      // If two are already selected, replace the second one
      setBreedingPartner(org);
    }
  };

  const handleBreed = (parent1: Organism, parent2: Organism) => {
    setPopulation(prev => {
      // Repopulate the entire garden with offspring from this cross
      // We use the current population length to maintain the same garden size
      return Array.from({ length: prev.length }).map(() => reproduce(parent1, parent2, mutationRate, phase));
    });
    
    // Increment the generation count to reflect the new population
    setGeneration(prev => prev + 1);
    
    // Clear selection and close the panel after mass breeding to show the new garden
    setSelectedOrganism(null);
    setBreedingPartner(null);
  };

  return (
    <div className={cn(
      "min-h-screen font-sans selection:bg-indigo-100 transition-colors duration-300",
      theme === 'dark' ? "bg-[#0C0A09] text-[#FAFAF9] dark" : "bg-[#F5F5F4] text-[#1C1917]"
    )}>
      <AnimatePresence>
        {showGameplay && (
          <GameplayGuide 
            onClose={() => setShowGameplay(false)} 
            language={language} 
            isDark={theme === 'dark'} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSplashVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto",
              theme === 'dark' ? "bg-black/80" : "bg-[#F5F5F4]/95"
            )}
          >
            <div className={cn(
              "max-w-xl w-full rounded-[2.5rem] shadow-2xl border p-8 md:p-10 my-auto transition-colors relative",
              theme === 'dark' ? "bg-[#1C1917] border-white/10 text-[#FAFAF9]" : "bg-white border-black/5 text-[#1C1917]"
            )}>
              <div className="absolute top-6 right-6 flex gap-1 z-10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLanguage(l => l === 'en' ? 'es' : 'en'); }}
                      className={cn(
                        "w-8 h-8 rounded-lg shadow-md flex items-center justify-center text-[10px] font-black border hover:scale-110 transition-transform",
                        theme === 'dark' ? "bg-white/10 text-white border-white/10" : "bg-stone-200 text-stone-900 border-stone-300"
                      )}
                    >
                      {language === 'en' ? 'ES' : 'EN'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTheme(t => t === 'light' ? 'dark' : 'light'); }}
                      className={cn(
                        "w-8 h-8 rounded-lg shadow-md flex items-center justify-center border hover:scale-110 transition-transform",
                        theme === 'dark' ? "bg-white/10 text-amber-400 border-white/10" : "bg-stone-200 text-stone-900 border-stone-300"
                      )}
                    >
                      {theme === 'light' ? <Sun size={14} /> : <Wind size={14} />}
                    </button>
              </div>

              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-6 relative group">
                  <Flower size={48} />
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Jardín Genético</h1>
                <p className={cn(
                  "font-medium max-w-sm",
                  theme === 'dark' ? "text-stone-400" : "text-gray-500"
                )}>
                  {t.tagline}
                </p>
              </div>

              <div className="space-y-8 mb-10">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4 text-center">{t.selectSpecies}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {FLOWER_THEMES.map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => setFlowerTheme(themeOption)}
                        className={cn(
                          "p-4 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
                          flowerTheme.id === themeOption.id 
                            ? "border-emerald-500 bg-emerald-50 shadow-inner" 
                            : theme === 'dark' 
                              ? "border-white/5 hover:border-white/20 bg-white/5"
                              : "border-stone-100 hover:border-emerald-200 bg-white shadow-sm"
                        )}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full shadow-md group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden border-2 border-black/10"
                            style={{ backgroundColor: `hsl(${themeOption.colors.hue.start}, ${themeOption.colors.saturation.start}%, ${themeOption.colors.lightness.start}%)` }}
                          >
                            <div 
                              className="w-6 h-6 bg-white/30"
                              style={{ 
                                borderRadius: themeOption.shapes.minRadius,
                                clipPath: themeOption.shapes.type === 'star' 
                                  ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                                  : themeOption.shapes.type === 'heart'
                                    ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
                                    : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                              }}
                            />
                          </div>
                          <div 
                            className="w-10 h-10 rounded-full shadow-md group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden border-2 border-black/10"
                            style={{ backgroundColor: `hsl(${themeOption.colors.hue.end}, ${themeOption.colors.saturation.end}%, ${themeOption.colors.lightness.end}%)` }}
                          >
                            <div 
                              className="w-6 h-6 bg-white/30"
                              style={{ 
                                borderRadius: themeOption.shapes.maxRadius,
                                clipPath: themeOption.shapes.type === 'star' 
                                  ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                                  : themeOption.shapes.type === 'heart'
                                    ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
                                    : "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                              }}
                            />
                          </div>
                        </div>
                        <h4 className="font-bold text-xs mb-1">{themeOption.name[language]}</h4>
                        <p className={cn(
                          "text-[10px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-2 left-4 right-4 p-1 rounded backdrop-blur-sm",
                          theme === 'dark' ? "bg-black/80 text-gray-300" : "bg-white/80 text-gray-500"
                        )}>
                          {themeOption.description[language]}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setIsSplashVisible(false)}
                  className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black text-xl hover:bg-emerald-600 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  {t.startGardening} <ArrowRight size={24} />
                </button>
                
                <button
                  onClick={() => setShowGameplay(true)}
                  className={cn(
                    "w-full py-4 border-2 rounded-3xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    theme === 'dark' 
                      ? "bg-white/5 text-emerald-400 border-white/10 hover:bg-white/10"
                      : "bg-white text-emerald-600 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50"
                  )}
                >
                  <BookOpen size={16} /> {t.seeGameplay}
                </button>

                <button
                  onClick={() => setShowChallenges(true)}
                  className={cn(
                    "w-full py-4 border-2 rounded-3xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                    theme === 'dark' 
                      ? "bg-white/5 text-amber-400 border-white/10 hover:bg-white/10"
                      : "bg-white text-amber-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50"
                  )}
                >
                  <Trophy size={16} /> {t.challenges}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenges Modal */}
      <AnimatePresence>
        {showChallenges && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]",
                theme === 'dark' ? "bg-[#1C1917] text-[#FAFAF9]" : "bg-white text-[#1C1917]"
              )}
            >
              <div className={cn(
                "p-8 border-b border-black/5 dark:border-white/10 flex justify-between items-center",
                theme === 'dark' ? "bg-[#1C1917] text-[#FAFAF9]" : "bg-white text-[#1C1917]"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                    <Trophy size={20} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{GAMEPLAY_GUIDE[language].challenges.title}</h2>
                </div>
                <button 
                  onClick={() => setShowChallenges(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className={cn(
                "p-8 overflow-y-auto space-y-6",
                theme === 'dark' ? "bg-[#1C1917]" : "bg-white"
              )}>
                {GAMEPLAY_GUIDE[language].challenges.list.map((challenge, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-xs">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-sm leading-tight group-hover:text-amber-600 transition-colors">
                        {challenge.task}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                        <Layout size={10} /> {challenge.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-black/5 dark:border-white/10">
                <button 
                  onClick={() => setShowChallenges(false)}
                  className="w-full py-4 bg-[#1C1917] dark:bg-[#FAFAF9] text-white dark:text-[#1C1917] rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all active:scale-95"
                >
                  {t.gotIt}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Finished Summary Screen */}
      <AnimatePresence>
        {isGameFinished && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-[110] overflow-y-auto transition-colors",
              theme === 'dark' ? "bg-[#0C0A09] text-[#FAFAF9]" : "bg-[#F5F5F4] text-[#1C1917]"
            )}
          >
            <div className="max-w-4xl mx-auto px-6 py-16">
              <div className="text-center mb-16">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/40"
                >
                  <Trophy size={48} />
                </motion.div>
                <h1 className="text-5xl font-black mb-4 tracking-tight">{t.congratulations}</h1>
                <p className="text-xl text-gray-500 dark:text-stone-400">{t.gameCompleteDesc}</p>
              </div>

              <div className="grid gap-6 mb-16">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <BookOpen className="text-indigo-600" /> {t.gameSummary}
                </h2>
                {Object.values(levelHistory).map((h: any, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 rounded-[32px] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{PHASE_DATA[h.phase as Phase].subtitle[language]}</h3>
                        <p className="text-sm text-gray-500 dark:text-stone-400">{t.generations}: <span className="font-bold text-gray-900 dark:text-[#FAFAF9]">{h.generation}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => restartLevel(h.phase as Phase)}
                        className="p-3 bg-white dark:bg-stone-800 text-gray-600 dark:text-stone-400 rounded-xl hover:text-indigo-600 transition-colors shadow-sm"
                        title={t.restartLevel}
                      >
                        <RefreshCw size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={downloadAllData}
                  className="flex-1 py-6 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={24} /> {t.downloadAll}
                </button>
                <button 
                  onClick={resetGame}
                  className="flex-1 py-6 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-stone-300 rounded-[24px] font-black text-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw size={24} /> {t.playAgain}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={cn(
        "border-b backdrop-blur-md sticky top-0 z-30 transition-colors",
        theme === 'dark' ? "bg-[#0C0A09]/80 border-white/10 text-[#FAFAF9]" : "bg-white/80 border-black/5 text-[#1C1917]"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Flower size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Jardín Genético</h1>
              <p className="text-[10px] font-mono uppercase tracking-tighter text-gray-400 -mt-1">Genetic Garden</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden sm:flex items-center gap-4 md:gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-mono">{t.genes}</span>
                <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400">
                  {numGenes}
                </span>
              </div>
              <div className="h-8 w-px bg-black/5 dark:bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-mono">{t.currentPhase}</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white">{currentPhaseData.subtitle[language]}</span>
              </div>
              <div className="h-8 w-px bg-black/5 dark:bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 font-mono">{t.generation}</span>
                <span className={cn(
                  "font-mono font-bold",
                  theme === 'dark' ? "text-indigo-400" : "text-black"
                )}>
                  {generation}
                </span>
              </div>
              <div className="h-8 w-px bg-black/5 dark:bg-white/10" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLanguage(l => l === 'en' ? 'es' : 'en')}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all",
                  theme === 'dark' ? "bg-white/10 hover:bg-white/20 text-white" : "bg-stone-200 hover:bg-stone-300 text-stone-900"
                )}
              >
                {language === 'en' ? 'ES' : 'EN'}
              </button>
              <button 
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  theme === 'dark' ? "bg-white/10 hover:bg-white/20 text-amber-400" : "bg-stone-200 hover:bg-stone-300 text-stone-900"
                )}
              >
                {theme === 'light' ? <Sun size={18} /> : <Wind size={18} />}
              </button>
              <button 
                onClick={() => setShowGameplay(true)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  theme === 'dark' ? "bg-white/10 hover:bg-white/20 text-indigo-400" : "bg-stone-200 hover:bg-stone-300 text-stone-900"
                )}
                title={t.seeGameplay}
              >
                <BookOpen size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Mobile Phase Info */}
          <div className="lg:hidden mb-6 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              <Sprout size={12} /> {t.currentPhase}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">{currentPhaseData.subtitle[language]}</h1>
            <p className="text-sm text-gray-500 dark:text-stone-400 leading-relaxed">
              {currentPhaseData.description[language]}
            </p>
          </div>

          <div className={cn(
            "p-6 rounded-2xl border shadow-sm space-y-6 transition-colors",
            theme === 'dark' ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
          )}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-stone-300">
                <Timer size={14} className="text-indigo-500" /> {t.generation}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-3xl font-black tabular-nums",
                  theme === 'dark' ? "text-white" : "text-black"
                )}>
                  {generation}
                </span>
                <div className="flex gap-1">
                  {generation >= DOWNLOAD_THRESHOLD && (
                    <span className="text-[10px] font-bold text-indigo-500" title="Data Ready">CSV</span>
                  )}
                  {generation >= PAUSE_THRESHOLD && (
                    <span className="text-xs font-bold text-emerald-600">✓</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "p-6 rounded-2xl border shadow-sm space-y-6 transition-colors",
            theme === 'dark' ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
          )}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">{t.management}</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="flex items-center gap-2"><Zap size={14} className="text-amber-500" /> {t.mutationRate}</label>
                  <span className="font-mono">{(mutationRate * 100).toFixed(1)}%</span>
                </div>
                <div className="relative flex items-center h-4">
                  <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                  <input 
                    type="range" 
                    min="0" 
                    max="0.2" 
                    step="0.005" 
                    value={mutationRate}
                    onChange={(e) => setMutationRate(parseFloat(e.target.value))}
                    className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="flex items-center gap-2"><Sprout size={14} className="text-emerald-500" /> {t.gardenSize}</label>
                  <span className="font-mono">{populationSize}</span>
                </div>
                <div className="relative flex items-center h-4">
                  <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    step="5" 
                    value={populationSize}
                    onChange={(e) => setPopulationSize(parseInt(e.target.value))}
                    className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="flex items-center gap-2"><Timer size={14} className="text-blue-500" /> {t.bloomSpeed}</label>
                  <span className="font-mono">{generationInterval}ms</span>
                </div>
                <div className="relative flex items-center h-4">
                  <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="50" 
                    value={generationInterval}
                    onChange={(e) => setGenerationInterval(parseInt(e.target.value))}
                    className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                  />
                </div>
              </div>

              {(phase === Phase.MULTI_GENE || phase === Phase.FULLY_POLYGENIC || phase === Phase.SELECTION_DRIFT) && (
                <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex justify-between text-xs font-medium">
                    <label className="flex items-center gap-2"><Dna size={14} className="text-indigo-500" /> {t.numGenes}</label>
                    <span className="font-mono">{numGenes}</span>
                  </div>
                  <div className="relative flex items-center h-4">
                    <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                    <input 
                      type="range" 
                      min={phase === Phase.MULTI_GENE ? 3 : 10} 
                      max={phase === Phase.MULTI_GENE ? 10 : 100} 
                      step={phase === Phase.MULTI_GENE ? 1 : 5} 
                      value={numGenes}
                      onChange={(e) => setNumGenes(parseInt(e.target.value))}
                      className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                    />
                  </div>
                </div>
              )}

              {phase === Phase.SELECTION_DRIFT && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <label className="flex items-center gap-2"><Sun size={14} className="text-amber-500" /> {t.targetColor}</label>
                      <div 
                        className="w-4 h-4 rounded-full border border-black/20" 
                        style={{ 
                          backgroundColor: `hsl(${flowerTheme.colors.hue.start + (flowerTheme.colors.hue.end - flowerTheme.colors.hue.start) * selectionTarget}, ${flowerTheme.colors.saturation.start + (flowerTheme.colors.saturation.end - flowerTheme.colors.saturation.start) * selectionTarget}%, ${flowerTheme.colors.lightness.start + (flowerTheme.colors.lightness.end - flowerTheme.colors.lightness.start) * selectionTarget}%)` 
                        }}
                      />
                    </div>
                    <div className="relative flex items-center h-4">
                      <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={selectionTarget}
                        onChange={(e) => setSelectionTarget(parseFloat(e.target.value))}
                        className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <label className="flex items-center gap-2">{t.selectionStrength}</label>
                      <span className="font-mono">{(selectionStrength * 100).toFixed(0)}%</span>
                    </div>
                    <div className="relative flex items-center h-4">
                    <div className="absolute w-full h-[1px] bg-emerald-200 dark:bg-emerald-900/30 top-1/2 -translate-y-1/2" />
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={selectionStrength}
                      onChange={(e) => setSelectionStrength(parseFloat(e.target.value))}
                      className="relative z-10 w-full h-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg appearance-none cursor-pointer accent-emerald-600 border border-emerald-200 dark:border-none"
                    />
                    </div>
                    <p className="text-[10px] text-gray-500 italic">
                      {selectionStrength === 0 
                        ? t.driftDesc 
                        : selectionStrength > 0.8 
                        ? t.selectionDesc 
                        : t.balancedDesc}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={openGardener}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md",
                  theme === 'dark' ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/20" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                <Edit3 size={18} /> {t.geneticGardener}
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!!selectedOrganism}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                  isPlaying 
                    ? theme === 'dark' ? "bg-rose-900/30 text-rose-400 hover:bg-rose-900/50 shadow-rose-900/20" : "bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
                )}
              >
                {selectedOrganism ? (
                  <><Pause size={18} /> {t.paused}</>
                ) : isPlaying ? (
                  <><Pause size={18} /> {t.stopSeasons}</>
                ) : (
                  <><Play size={18} /> {t.startSeasons}</>
                )}
              </button>
              
              <button 
                onClick={runGeneration}
                disabled={isPlaying || !!selectedOrganism}
                className={cn(
                  "w-full py-3 border rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  theme === 'dark' ? "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                <ArrowRight size={18} /> {t.nextGen}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => downloadData()}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm",
                    theme === 'dark' ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  )}
                >
                  <Download size={18} /> {t.downloadData}
                </button>
                <button 
                  onClick={() => restartLevel()}
                  className={cn(
                    "py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm",
                    theme === 'dark' ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  )}
                >
                  <RotateCcw size={18} /> {t.restartLevel}
                </button>
              </div>

              <div className="pt-6 border-t border-black/5 dark:border-white/10">
                <button 
                  onClick={nextPhase}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
                    theme === 'dark' ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/20" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                  )}
                >
                  {t.advance} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9 space-y-8">
          {/* Desktop Phase Info */}
          <div className="hidden lg:block space-y-4 mb-12">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              <Sprout size={16} /> {t.currentPhase}
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none">{currentPhaseData.subtitle[language]}</h1>
            <p className="text-lg text-gray-500 dark:text-stone-400 leading-relaxed max-w-2xl">
              {currentPhaseData.description[language]}
            </p>
          </div>

          {/* Visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Histogram 
              data={phenotypeData} 
              bins={phase >= Phase.MULTI_GENE ? 20 : 5}
              label={t.colorDist}
              theme={flowerTheme}
              isDark={theme === 'dark'}
            />
            <PhenotypeHistoryChart 
              history={history} 
              theme={flowerTheme} 
              isDark={theme === 'dark'}
              label={t.phenoEvo}
            />
          </div>

          <PopulationGrid 
            population={population} 
            layoutMode={layoutMode} 
            setLayoutMode={setLayoutMode}
            theme={flowerTheme} 
            isDark={theme === 'dark'}
            onSelectOrganism={handleSelectOrganism}
            selectedId={selectedOrganism?.id}
            partnerId={breedingPartner?.id}
            t={t}
          />

          <AnimatePresence>
            {selectedOrganism && breedingPartner && (
              <OrganismDetailPanel 
                organism={selectedOrganism}
                partner={breedingPartner}
                onClose={() => {
                  setSelectedOrganism(null);
                  setBreedingPartner(null);
                }}
                onSelectPartner={setBreedingPartner}
                onBreed={handleBreed}
                theme={flowerTheme}
                isDark={theme === 'dark'}
                language={language}
                phase={phase}
                mutationRate={mutationRate}
              />
            )}
          </AnimatePresence>

          {/* Concept Reveal Modal / Section */}
          <AnimatePresence>
            {showConcept && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={cn(
                  "p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-colors",
                  theme === 'dark' ? "bg-emerald-950 text-white shadow-emerald-900/20" : "bg-emerald-900 text-white shadow-emerald-200"
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/30 rounded-lg">
                      <Sprout size={24} className="text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-bold">{currentPhaseData.conceptName?.[language]}</h3>
                  </div>
                  <p className="text-emerald-100 leading-relaxed text-lg mb-8 max-w-2xl">
                    {currentPhaseData.conceptSummary?.[language]}
                  </p>
                  
                  <button 
                    onClick={() => setShowConcept(false)}
                    className={cn(
                      "group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95",
                      theme === 'dark' ? "bg-emerald-500 text-white hover:bg-emerald-400" : "bg-white text-emerald-900 hover:bg-emerald-50"
                    )}
                  >
                    {t.gotIt}
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute bottom-0 right-0 p-12 opacity-10">
                  <Flower size={180} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className={cn(
        "border-t py-4 mt-12 transition-colors",
        theme === 'dark' ? "bg-black/40 border-white/10" : "bg-white border-black/5"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-mono text-gray-400 dark:text-stone-500 uppercase tracking-widest">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Sprout size={12} /> {t.garden}: {population.length} {t.flowers}</span>
            <span className="flex items-center gap-1"><Zap size={12} /> {t.mutation}: {(mutationRate * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{t.health}</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}
