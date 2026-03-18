import React, { useMemo, memo } from 'react';
import { Organism } from '../types';
import { motion } from 'motion/react';
import { FlowerTheme } from '../constants';
import { cn } from '../lib/utils';

interface PopulationGridProps {
  population: Organism[];
  layoutMode: 'grid' | 'concentric' | 'color';
  setLayoutMode: (mode: 'grid' | 'concentric' | 'color') => void;
  theme: FlowerTheme;
  isDark?: boolean;
  onSelectOrganism?: (org: Organism) => void;
  selectedId?: string;
  partnerId?: string;
  t: any;
}

export const PopulationGrid: React.FC<PopulationGridProps> = ({ 
  population, 
  layoutMode, 
  setLayoutMode,
  theme, 
  isDark = false,
  onSelectOrganism,
  selectedId,
  partnerId,
  t
}) => {
  // We only show a subset if population is huge to avoid lag
  const displayLimit = 64;
  const displayPop = population.slice(0, displayLimit);

  const positionedPopulation = useMemo(() => {
    let sorted = [...displayPop];
    
    if (layoutMode === 'color') {
      sorted.sort((a, b) => a.phenotype - b.phenotype);
    } else if (layoutMode === 'concentric') {
      // Frequency-based sorting
      const binCount = 10;
      const bins = new Array(binCount).fill(0);
      displayPop.forEach(org => {
        const binIdx = Math.min(binCount - 1, Math.floor(org.phenotype * binCount));
        bins[binIdx]++;
      });

      sorted.sort((a, b) => {
        const binA = Math.min(binCount - 1, Math.floor(a.phenotype * binCount));
        const binB = Math.min(binCount - 1, Math.floor(b.phenotype * binCount));
        return bins[binA] - bins[binB];
      });
    }

    // Map to grid positions
    const cols = 10;
    const rows = 10;
    const centerR = 4.5;
    const centerC = 4.5;

    let gridCells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.sqrt(Math.pow(r - centerR, 2) + Math.pow(c - centerC, 2));
        gridCells.push({ r, c, dist });
      }
    }

    // Always use concentric layout for all modes as requested
    gridCells.sort((a, b) => a.dist - b.dist);

    return sorted.map((org, i) => {
      const cell = gridCells[i] || { r: 0, c: 0 };
      return { ...org, r: cell.r, c: cell.c };
    });
  }, [displayPop, layoutMode]);

  return (
    <div className={cn(
      "p-6 rounded-3xl border min-h-[400px] shadow-inner relative overflow-hidden transition-colors",
      isDark ? "bg-[#1C1917] border-white/10" : "bg-[#E7E5E4] border-black/5"
    )}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-stone-400 italic">Ventana al jardín</span>
          <span className="text-[10px] font-mono text-gray-400 dark:text-stone-500">{displayPop.length} Flores floreciendo</span>
        </div>

        <div className="flex gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
          <button 
            onClick={() => setLayoutMode('grid')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              layoutMode === 'grid' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            )}
          >
            {t.layoutRandom}
          </button>
          <button 
            onClick={() => setLayoutMode('concentric')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              layoutMode === 'concentric' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            )}
          >
            {t.layoutFreq}
          </button>
          <button 
            onClick={() => setLayoutMode('color')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
              layoutMode === 'color' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            )}
          >
            {t.layoutColor}
          </button>
        </div>
      </div>
      
      <div className="relative w-full h-[320px] flex items-center justify-center">
        {positionedPopulation.map((org) => {
          const { r, c } = org as any;
          const x = (c - 4.5) * 36;
          const y = (r - 4.5) * 36;
          const isSelected = org.id === selectedId;
          const isPartner = org.id === partnerId;

          return (
            <motion.div
              key={org.id}
              initial={false}
              animate={{ 
                x, 
                y,
                scale: isSelected || isPartner ? 1.4 : 1,
                zIndex: isSelected || isPartner ? 30 : 1
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className={cn(
                "absolute flex items-center justify-center group cursor-pointer",
                isSelected && "ring-2 ring-emerald-500 ring-offset-4 rounded-full",
                isPartner && "ring-2 ring-amber-500 ring-offset-4 rounded-full"
              )}
              onClick={() => onSelectOrganism?.(org)}
            >
              <FlowerIconMemo org={org} theme={theme} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const FlowerIcon = ({ org, theme }: { org: Organism, theme: FlowerTheme }) => {
  // Derive shape variation from phenotype
  const { colors, shapes, pattern } = theme;
  const borderRadius = org.phenotype < 0.3 ? shapes.minRadius : org.phenotype > 0.7 ? shapes.maxRadius : shapes.midRadius;
  const rotation = (org.phenotype * 360) % 45;

  // Calculate color components based on theme ranges
  const hue = colors.hue.start + (colors.hue.end - colors.hue.start) * org.phenotype;
  const saturation = colors.saturation.start + (colors.saturation.end - colors.saturation.start) * org.phenotype;
  const lightness = colors.lightness.start + (colors.lightness.end - colors.lightness.start) * org.phenotype;

  return (
    <div className="relative flex items-center justify-center will-change-transform">
      {/* Flower Petals */}
      <div 
        className="w-6 h-6 shadow-sm relative overflow-hidden"
        style={{
          backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          borderRadius: borderRadius,
          transform: `rotate(${rotation}deg)`,
          clipPath: shapes.type === 'star' 
            ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
            : shapes.type === 'heart'
              ? "polygon(50% 15%, 80% 0%, 100% 20%, 100% 50%, 50% 100%, 0% 50%, 0% 20%, 20% 0%)"
              : shapes.type === 'leaf'
                ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                : "none"
        }}
      >
        {/* Pattern: Dots (Simplified) */}
        {pattern === 'dots' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
            backgroundImage: 'radial-gradient(circle, currentColor 0.5px, transparent 0.5px)',
            backgroundSize: '3px 3px',
            color: lightness > 70 ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
          }} />
        )}
        
        <div className="absolute inset-0 border border-black/5" style={{ borderRadius: borderRadius }} />
      </div>
      
      {/* Flower Center */}
      <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full" />
    </div>
  );
};

const FlowerIconMemo = memo(FlowerIcon);
