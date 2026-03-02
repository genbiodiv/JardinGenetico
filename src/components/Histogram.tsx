import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { FlowerTheme } from '../constants';
import { cn } from '../lib/utils';

interface HistogramProps {
  data: number[];
  bins?: number;
  label?: string;
  domain?: [number, number];
  theme: FlowerTheme;
  isDark?: boolean;
}

export const Histogram: React.FC<HistogramProps> = ({ 
  data, 
  bins = 10, 
  label = 'Phenotype Distribution',
  domain = [0, 1],
  theme,
  isDark = false
}) => {
  const width = 400;
  const height = 150;
  const margin = { top: 10, right: 10, bottom: 20, left: 30 };

  const stats = useMemo(() => {
    const binGenerator = d3.bin()
      .domain(domain)
      .thresholds(bins);
    
    const binnedData = binGenerator(data);
    const maxCount = d3.max(binnedData, d => d.length) || 0;

    return { binnedData, maxCount };
  }, [data, bins, domain]);

  const xScale = d3.scaleLinear()
    .domain(domain)
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([0, stats.maxCount])
    .range([height - margin.bottom, margin.top]);

  const { colors } = theme;

  return (
    <div className={cn(
      "p-4 rounded-xl border shadow-sm transition-colors",
      isDark ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{label}</span>
        <span className="text-xs font-mono text-gray-400">n={data.length}</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Axes */}
        <line 
          x1={margin.left} 
          y1={height - margin.bottom} 
          x2={width - margin.right} 
          y2={height - margin.bottom} 
          stroke={isDark ? "#292524" : "#94a3b8"} 
          strokeWidth={1}
        />
        
        {/* Bars */}
        {stats.binnedData.map((d, i) => {
          const barWidth = xScale(d.x1 || 0) - xScale(d.x0 || 0) - 1;
          const barHeight = (height - margin.bottom) - yScale(d.length);
          
          // Calculate color based on the midpoint of the bin
          const phenotype = ((d.x0 || 0) + (d.x1 || 0)) / 2;
          const hue = colors.hue.start + (colors.hue.end - colors.hue.start) * phenotype;
          const saturation = colors.saturation.start + (colors.saturation.end - colors.saturation.start) * phenotype;
          const lightness = colors.lightness.start + (colors.lightness.end - colors.lightness.start) * phenotype;
          const barColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          
          return (
            <rect
              key={i}
              x={xScale(d.x0 || 0)}
              y={yScale(d.length)}
              width={Math.max(0, barWidth)}
              height={Math.max(0, barHeight)}
              fill={barColor}
              className="transition-all duration-300 ease-in-out opacity-90 hover:opacity-100 stroke-black/5"
            />
          );
        })}

        {/* Labels */}
        <text 
          x={margin.left} 
          y={height - 5} 
          fontSize="8" 
          fill={isDark ? "#78716c" : "#64748b"} 
          textAnchor="start"
        >
          {domain[0]}
        </text>
        <text 
          x={width - margin.right} 
          y={height - 5} 
          fontSize="8" 
          fill={isDark ? "#78716c" : "#64748b"} 
          textAnchor="end"
        >
          {domain[1]}
        </text>
      </svg>
    </div>
  );
};
