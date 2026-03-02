import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, ChevronRight, Target, Settings, Info } from 'lucide-react';
import { GAMEPLAY_GUIDE } from '../constants';
import { cn } from '../lib/utils';

interface GameplayGuideProps {
  onClose: () => void;
  language: 'en' | 'es';
  isDark: boolean;
}

export const GameplayGuide: React.FC<GameplayGuideProps> = ({ onClose, language, isDark }) => {
  const g = GAMEPLAY_GUIDE[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[60] backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto",
        isDark ? "bg-black/90" : "bg-white/90"
      )}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={cn(
          "max-w-3xl w-full rounded-[2.5rem] shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden",
          isDark ? "bg-[#1C1917] border-white/10" : "bg-white border-black/5"
        )}
      >
        {/* Header */}
        <div className="p-8 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {language === 'en' ? 'Gameplay Guide' : 'Guía de Juego'}
              </h2>
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400">Genetica Garden Manual</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Intro */}
          <section className="space-y-4">
            <p className={cn(
              "text-lg leading-relaxed font-medium",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {g.intro}
            </p>
            <div className={cn(
              "p-6 rounded-3xl border text-sm leading-relaxed italic",
              isDark ? "bg-indigo-900/10 border-indigo-900/30 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-700"
            )}>
              {g.credits}
            </div>
          </section>

          {/* How to Play */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
              <Info size={14} /> {g.howToPlay.title}
            </div>
            <div className="space-y-4">
              {g.howToPlay.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-black text-indigo-600">
                    {i + 1}
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Phases */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-500">
              <ChevronRight size={14} /> {g.phases.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {g.phases.list.map((phase, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "p-5 rounded-2xl border transition-colors",
                    isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-black/5"
                  )}
                >
                  <h4 className="font-bold text-sm mb-2 text-emerald-600 dark:text-emerald-400">{phase.name}</h4>
                  <p className={cn(
                    "text-xs leading-relaxed",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {phase.objective}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Concepts */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500">
              <Target size={14} /> {g.concepts.title}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {g.concepts.list.map((concept, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {concept.name}
                  </h4>
                  <p className={cn(
                    "text-xs leading-relaxed pl-3.5 border-l border-indigo-100 dark:border-indigo-900/30",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {concept.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Controls */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500">
              <Settings size={14} /> {g.controls.title}
            </div>
            <div className="space-y-4">
              {g.controls.items.map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className={cn(
                    "text-xs leading-relaxed",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-black/5 dark:border-white/10">
          <button
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
          >
            {language === 'en' ? 'Got it, let\'s garden!' : '¡Entendido, a jardinear!'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
