import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { FlowerTheme } from '../constants';

interface PhenotypeHistoryChartProps {
  history: any[];
  theme: FlowerTheme;
  isDark?: boolean;
  label?: string;
}

export const PhenotypeHistoryChart: React.FC<PhenotypeHistoryChartProps> = ({ 
  history, 
  theme, 
  isDark = false,
  label = 'Color Frequency Over Time'
}) => {
  const [lineCount, setLineCount] = useState(5);

  const lines = useMemo(() => {
    if (history.length === 0) return [];
    
    const lastPoint = history[history.length - 1];
    const binKeys = Object.keys(lastPoint).filter(k => k.startsWith('B'));
    
    // Sort keys by current frequency
    const sortedKeys = binKeys.sort((a, b) => lastPoint[b] - lastPoint[a]);
    
    const maxBins = binKeys.length;
    const actualLineCount = Math.min(lineCount, maxBins);
    
    return sortedKeys.slice(0, actualLineCount).map(key => {
      const binIdx = parseInt(key.substring(1));
      const phenotype = (binIdx + 0.5) / maxBins;
      
      const { colors } = theme;
      const hue = colors.hue.start + (colors.hue.end - colors.hue.start) * phenotype;
      const saturation = colors.saturation.start + (colors.saturation.end - colors.saturation.start) * phenotype;
      const lightness = colors.lightness.start + (colors.lightness.end - colors.lightness.start) * phenotype;
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      return { key, color };
    });
  }, [history, theme, lineCount]);

  const maxBins = history.length > 0 ? Object.keys(history[0]).filter(k => k.startsWith('B')).length : 5;

  return (
    <div className={cn(
      "p-4 rounded-xl border shadow-sm h-[240px] flex flex-col transition-colors",
      isDark ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-mono">Lines:</span>
          <select 
            value={lineCount} 
            onChange={(e) => setLineCount(parseInt(e.target.value))}
            className={cn(
              "text-[10px] font-mono rounded px-1 border",
              isDark ? "bg-stone-800 border-white/10 text-gray-300" : "bg-gray-50 border-black/5 text-gray-600"
            )}
          >
            {[1, 3, 5, 10, 20].filter(n => n <= maxBins).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={isDark ? "#292524" : "#e2e8f0"} 
            />
            <XAxis 
              dataKey="generation" 
              hide 
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: isDark ? '#78716c' : '#64748b' }}
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: '10px', 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: isDark ? '#1C1917' : '#fff',
                color: isDark ? '#FAFAF9' : '#1C1917'
              }}
              labelStyle={{ fontWeight: 'bold' }}
              itemStyle={{ padding: '0' }}
            />
            {lines.map(line => (
              <Line 
                key={line.key}
                type="monotone" 
                dataKey={line.key} 
                stroke={line.color} 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
