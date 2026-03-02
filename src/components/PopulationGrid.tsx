import React, { useMemo } from 'react';
import { Organism } from '../types';
import { motion } from 'motion/react';
import { FlowerTheme } from '../constants';
import { cn } from '../lib/utils';

interface PopulationGridProps {
  population: Organism[];
  layoutMode: 'grid' | 'concentric' | 'color';
  theme: FlowerTheme;
  isDark?: boolean;
  onSelectOrganism?: (org: Organism) => void;
  selectedId?: string;
  partnerId?: string;
}

export const PopulationGrid: React.FC<PopulationGridProps> = ({ 
  population, 
  layoutMode, 
  theme, 
  isDark = false,
  onSelectOrganism,
  selectedId,
  partnerId
}) => {
  // We only show a subset if population is huge to avoid lag
  const displayLimit = 100;
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

    if (layoutMode === 'concentric') {
      gridCells.sort((a, b) => a.dist - b.dist);
    } else {
      // Standard row-by-row for grid and color
      gridCells.sort((a, b) => (a.r * 10 + a.c) - (b.r * 10 + b.c));
    }

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
      <div className="flex justify-between items-center mb-6 relative z-10">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500 italic">The Garden Bed</span>
        <span className="text-xs font-mono text-gray-400">{displayPop.length} Flowers Blooming</span>
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
              <FlowerIcon org={org} theme={theme} />
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
    <div className="relative flex items-center justify-center">
      {/* Flower Petals */}
      <div 
        className="w-6 h-6 shadow-sm transition-all duration-500 relative overflow-hidden"
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
        {/* Pattern: Dots */}
        {pattern === 'dots' && (
          <div className="absolute inset-0 opacity-40" style={{ 
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '4px 4px',
            color: lightness > 70 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)'
          }} />
        )}
        
        {/* Simple petal cross */}
        <div className="absolute inset-0 border border-black/10" style={{ borderRadius: borderRadius }} />
      </div>
      
      {/* Flower Center */}
      <div className="absolute w-1.5 h-1.5 bg-amber-400 rounded-full shadow-xs" />
      
      {/* Stem */}
      <div className="absolute -bottom-1 w-0.5 h-1 bg-emerald-600/20 rounded-full -z-10" />
      
      <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[8px] px-1 rounded z-20 pointer-events-none">
        {org.phenotype.toFixed(2)}
      </div>
    </div>
  );
};
