import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Dna, Info, ChevronRight, Edit3, Save, RotateCcw } from 'lucide-react';
import { Organism, Phase } from '../types';
import { FlowerTheme } from '../constants';
import { cn } from '../lib/utils';
import { reproduce, calculatePhenotype } from '../engine';

interface OrganismDetailPanelProps {
  organism: Organism | null;
  partner: Organism | null;
  onClose: () => void;
  onSelectPartner: (org: Organism | null) => void;
  onBreed: (p1: Organism, p2: Organism) => void;
  theme: FlowerTheme;
  isDark: boolean;
  language: 'en' | 'es';
  phase: Phase;
  mutationRate: number;
}

export const OrganismDetailPanel: React.FC<OrganismDetailPanelProps> = ({
  organism,
  partner,
  onClose,
  onSelectPartner,
  onBreed,
  theme,
  isDark,
  language,
  phase,
  mutationRate
}) => {
  const t = useMemo(() => ({
    en: {
      details: "Flower Details",
      geneticArch: "Genetic Architecture",
      traits: "Phenotypic Traits",
      colorVal: "Color Value",
      alleles: "Alleles",
      breeding: "Breeding Program",
      selectPartner: "Select a partner in the garden to breed",
      breedWith: "Breed with",
      offspringPreview: "Offspring Preview",
      potentialOffspring: "Potential Offspring",
      close: "Close",
      phenotype: "Phenotype",
      dominant: "Dominant",
      recessive: "Recessive",
      heterozygous: "Heterozygous",
      homozygous: "Homozygous",
      genes: "Genes",
      clearPartner: "Clear Partner",
      performCross: "Perform Cross",
      editMode: "Genetic Editing Mode",
      editDesc: "Click an allele to toggle its state (Dominant/Recessive)",
      resetGenes: "Reset to Original",
      modified: "Modified",
      domLetter: "Dominant Allele",
      recLetter: "Recessive Allele",
      partnerId: "Partner ID",
      total: "total",
      dominantAlleles: "dominant"
    },
    es: {
      details: "Detalles de la Flor",
      geneticArch: "Arquitectura Genética",
      traits: "Rasgos Fenotípicos",
      colorVal: "Valor de Color",
      alleles: "Alelos",
      breeding: "Programa de Cría",
      selectPartner: "Selecciona un compañero en el jardín para criar",
      breedWith: "Criar con",
      offspringPreview: "Vista Previa de la Cría",
      potentialOffspring: "Cría Potencial",
      close: "Cerrar",
      phenotype: "Fenotipo",
      dominant: "Dominante",
      recessive: "Recesivo",
      heterozygous: "Heterocigoto",
      homozygous: "Homocigoto",
      genes: "Genes",
      clearPartner: "Limpiar Compañero",
      performCross: "Realizar Cruce",
      editMode: "Modo de Edición Genética",
      editDesc: "Haz clic en un alelo para cambiar su estado (Dominante/Recesivo)",
      resetGenes: "Restablecer Original",
      modified: "Modificado",
      domLetter: "Alelo Dominante",
      recLetter: "Alelo Recesivo",
      partnerId: "ID de Compañero",
      total: "total",
      dominantAlleles: "dominantes"
    }
  }[language]), [language]);

  const [editedOrganism, setEditedOrganism] = useState<Organism | null>(null);

  useEffect(() => {
    setEditedOrganism(organism);
  }, [organism]);

  const currentOrg = editedOrganism || organism;

  const offspringPreview = useMemo(() => {
    if (!currentOrg || !partner) return null;
    // Generate 3 potential offspring
    return Array.from({ length: 3 }).map((_, i) => reproduce(currentOrg, partner, mutationRate, phase));
  }, [currentOrg, partner, mutationRate, phase]);

  const handleBreed = () => {
    if (!currentOrg || !partner) return;
    onBreed(currentOrg, partner);
  };

  const toggleAllele = (geneIndex: number, alleleIndex: number) => {
    if (!editedOrganism) return;

    const newGenotype = [...editedOrganism.genotype];
    const index = geneIndex * 2 + alleleIndex;
    newGenotype[index] = newGenotype[index] === 1 ? 0 : 1;

    setEditedOrganism({
      ...editedOrganism,
      genotype: newGenotype,
      phenotype: calculatePhenotype(newGenotype, phase)
    });
  };

  const resetGenes = () => {
    setEditedOrganism(organism);
  };

  if (!organism || !currentOrg) return null;

  const traitDescription = useMemo(() => {
    const p = currentOrg.phenotype;
    if (language === 'en') {
      if (p < 0.2) return "Deep, intense pigmentation. Highly saturated petals.";
      if (p < 0.4) return "Rich coloration with moderate saturation.";
      if (p < 0.6) return "Balanced intermediate shade. Standard variation.";
      if (p < 0.8) return "Soft, pastel-like hues. Lighter pigmentation.";
      return "Delicate, pale coloration. Minimal pigment expression.";
    } else {
      if (p < 0.2) return "Pigmentación profunda e intensa. Pétalos muy saturados.";
      if (p < 0.4) return "Coloración rica con saturación moderada.";
      if (p < 0.6) return "Tono intermedio equilibrado. Variación estándar.";
      if (p < 0.8) return "Tonos suaves, tipo pastel. Pigmentación más clara.";
      return "Coloración pálida y delicada. Expresión mínima de pigmento.";
    }
  }, [currentOrg.phenotype, language]);

  const hue = theme.colors.hue.start + (theme.colors.hue.end - theme.colors.hue.start) * currentOrg.phenotype;
  const saturation = theme.colors.saturation.start + (theme.colors.saturation.end - theme.colors.saturation.start) * currentOrg.phenotype;
  const lightness = theme.colors.lightness.start + (theme.colors.lightness.end - theme.colors.lightness.start) * currentOrg.phenotype;
  const borderRadius = currentOrg.phenotype < 0.3 ? theme.shapes.minRadius : currentOrg.phenotype > 0.7 ? theme.shapes.maxRadius : theme.shapes.midRadius;

  const genes = useMemo(() => {
    if (!currentOrg) return [];
    const g = [];
    for (let i = 0; i < currentOrg.genotype.length; i += 2) {
      g.push({
        alleles: [currentOrg.genotype[i], currentOrg.genotype[i + 1]]
      });
    }
    return g;
  }, [currentOrg]);

  const isModified = useMemo(() => {
    if (!organism || !editedOrganism) return false;
    return JSON.stringify(organism.genotype) !== JSON.stringify(editedOrganism.genotype);
  }, [organism, editedOrganism]);

  const getAlleleDisplay = (geneIndex: number, value: number) => {
    const isEven = geneIndex % 2 === 0;
    if (value === 1) {
      return {
        letter: isEven ? 'A' : 'C',
        color: "bg-emerald-600 text-white shadow-sm shadow-emerald-200 dark:shadow-none",
        label: t.domLetter
      };
    } else {
      return {
        letter: isEven ? 'T' : 'G',
        color: "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/20",
        label: t.recLetter
      };
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[400px] z-40 shadow-2xl border-l flex flex-col overflow-hidden",
        isDark ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
            <Info size={20} />
          </div>
          <h2 className="font-bold text-lg">{t.details}</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Visual Summary */}
        <div className="flex flex-col items-center text-center">
          <div 
            className="w-24 h-24 shadow-xl mb-4 relative flex items-center justify-center overflow-hidden"
            style={{
              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
              borderRadius: borderRadius,
              clipPath: theme.shapes.type === 'star' 
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : theme.shapes.type === 'heart'
                  ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
                  : theme.shapes.type === 'leaf'
                    ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                    : "none"
            }}
          >
            {/* Pattern: Dots */}
            {theme.pattern === 'dots' && (
              <div className="absolute inset-0 opacity-40" style={{ 
                backgroundImage: 'radial-gradient(circle, currentColor 2px, transparent 2px)',
                backgroundSize: '8px 8px',
                color: lightness > 70 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'
              }} />
            )}
            <div className="absolute w-4 h-4 bg-amber-400 rounded-full shadow-inner" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              ID: {currentOrg.id.slice(0, 8)}
              {isModified && (
                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded text-[8px] font-bold uppercase">
                  {t.modified}
                </span>
              )}
            </p>
            <p className="font-bold text-xl">{t.phenotype}: {currentOrg.phenotype.toFixed(3)}</p>
            <p className="text-xs text-gray-500 italic max-w-[240px] mx-auto">{traitDescription}</p>
          </div>
        </div>

        {/* Genetic Architecture */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <Dna size={14} /> {t.geneticArch}
            </div>
            {isModified && (
              <button 
                onClick={resetGenes}
                className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
              >
                <RotateCcw size={10} /> {t.resetGenes}
              </button>
            )}
          </div>
          
          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Edit3 size={12} /> {t.editMode}
            </div>
            <p className="text-[9px] text-indigo-500/70 dark:text-indigo-400/50 italic leading-tight">
              {t.editDesc}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {genes.map((gene, i) => (
              <div key={i} className="space-y-1">
                <div className="flex gap-0.5">
                  {gene.alleles.map((a, j) => {
                    const display = getAlleleDisplay(i, a);
                    return (
                      <button 
                        key={j} 
                        onClick={() => toggleAllele(i, j)}
                        className={cn(
                          "flex-1 h-8 rounded flex items-center justify-center text-[10px] font-bold transition-all active:scale-90",
                          display.color
                        )}
                        title={display.label}
                      >
                        {display.letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic">
            {genes.length} {t.genes} {t.total}. {t.alleles}: {genes.flatMap(g => g.alleles).reduce((a, b) => a + b, 0)} {t.dominantAlleles}.
          </p>
        </div>

        {/* Breeding Program */}
        <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Heart size={14} className="text-rose-500" /> {t.breeding}
          </div>
          
          {!partner ? (
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center">
              <p className="text-xs text-gray-500">{t.selectPartner}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 shadow-sm overflow-hidden relative"
                    style={{
                      backgroundColor: `hsl(${theme.colors.hue.start + (theme.colors.hue.end - theme.colors.hue.start) * partner.phenotype}, ${theme.colors.saturation.start + (theme.colors.saturation.end - theme.colors.saturation.start) * partner.phenotype}%, ${theme.colors.lightness.start + (theme.colors.lightness.end - theme.colors.lightness.start) * partner.phenotype}%)`,
                      borderRadius: partner.phenotype < 0.3 ? theme.shapes.minRadius : partner.phenotype > 0.7 ? theme.shapes.maxRadius : theme.shapes.midRadius,
                      clipPath: theme.shapes.type === 'star' 
                        ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                        : theme.shapes.type === 'heart'
                          ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
                          : theme.shapes.type === 'leaf'
                            ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                            : "none"
                    }}
                  >
                    {/* Pattern: Dots */}
                    {theme.pattern === 'dots' && (
                      <div className="absolute inset-0 opacity-40" style={{ 
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '4px 4px',
                        color: (theme.colors.lightness.start + (theme.colors.lightness.end - theme.colors.lightness.start) * partner.phenotype) > 70 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'
                      }} />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-amber-600 uppercase tracking-widest">{t.partnerId}: {partner.id.slice(0, 8)}</p>
                    <p className="font-bold text-sm">{t.phenotype}: {partner.phenotype.toFixed(3)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSelectPartner(null)}
                  className="text-amber-600 hover:text-amber-700 text-[10px] font-bold uppercase"
                >
                  {t.clearPartner}
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.potentialOffspring}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {offspringPreview?.map((child, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                      <div 
                        className="w-12 h-12 shadow-sm overflow-hidden relative"
                        style={{
                          backgroundColor: `hsl(${theme.colors.hue.start + (theme.colors.hue.end - theme.colors.hue.start) * child.phenotype}, ${theme.colors.saturation.start + (theme.colors.saturation.end - theme.colors.saturation.start) * child.phenotype}%, ${theme.colors.lightness.start + (theme.colors.lightness.end - theme.colors.lightness.start) * child.phenotype}%)`,
                          borderRadius: child.phenotype < 0.3 ? theme.shapes.minRadius : child.phenotype > 0.7 ? theme.shapes.maxRadius : theme.shapes.midRadius,
                          clipPath: theme.shapes.type === 'star' 
                            ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                            : theme.shapes.type === 'heart'
                              ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
                              : theme.shapes.type === 'leaf'
                                ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                                : "none"
                        }}
                      >
                        {/* Pattern: Dots */}
                        {theme.pattern === 'dots' && (
                          <div className="absolute inset-0 opacity-40" style={{ 
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '4px 4px',
                            color: (theme.colors.lightness.start + (theme.colors.lightness.end - theme.colors.lightness.start) * child.phenotype) > 70 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'
                          }} />
                        )}
                      </div>
                      <span className="text-[10px] font-bold">{child.phenotype.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleBreed}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 shadow-xl shadow-rose-200 dark:shadow-rose-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Heart size={18} /> {t.performCross}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
