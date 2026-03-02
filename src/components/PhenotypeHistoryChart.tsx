import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

interface PhenotypeHistoryChartProps {
  history: any[];
  colors: string[];
  isDark?: boolean;
  label?: string;
}

export const PhenotypeHistoryChart: React.FC<PhenotypeHistoryChartProps> = ({ 
  history, 
  colors, 
  isDark = false,
  label = 'Color Frequency Over Time'
}) => {
  return (
    <div className={cn(
      "p-4 rounded-xl border shadow-sm h-[200px] transition-colors",
      isDark ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
    )}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-gray-500">{label}</span>
      </div>
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
          <Line 
            type="monotone" 
            dataKey="T1" 
            stroke={colors[0]} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="T2" 
            stroke={colors[1]} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="T3" 
            stroke={colors[2]} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="T4" 
            stroke={colors[3]} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="T5" 
            stroke={colors[4]} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
