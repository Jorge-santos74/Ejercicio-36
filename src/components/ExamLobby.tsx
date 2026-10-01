import React, { useState } from 'react';
import { 
  Play, 
  Timer, 
  Award, 
  Sparkles, 
  Calculator, 
  BookOpen, 
  Atom, 
  Globe2, 
  AlertCircle, 
  Clock, 
  BrainCircuit, 
  CheckCircle2,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { SUBJECTS_INFO } from '../data/mockExamBank';

interface ExamLobbyProps {
  onStartExam: (config: { totalQuestions: number; timeLimitMinutes: number; examTitle: string }) => void;
  onOpenSpec: () => void;
}

export const ExamLobby: React.FC<ExamLobbyProps> = ({ onStartExam, onOpenSpec }) => {
  const [examType, setExamType] = useState<'quick' | 'standard'>('quick');

  const config = examType === 'quick' 
    ? { totalQuestions: 8, timeLimitMinutes: 8, title: 'Simulacro Rápido Diagnóstico (8 mins)' }
    : { totalQuestions: 12, timeLimitMinutes: 15, title: 'Simulacro Completo de Admisión (15 mins)' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Condiciones Reales de Examen de Admisión</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Practica antes del gran día con <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">retroalimentación de IA</span>
          </h1>

          <p className="text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed">
            La mayoría de postulantes fracasa por primera vez frente al reloj y la fatiga cognitiva. 
            Rinde un ensayo cronometrado, descubre tu área más vulnerable y recibe un refuerzo personalizado con Inteligencia Artificial.
          </p>

          {/* Quick value badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
              <Timer className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-300">Cronómetro estricto real</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
              <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">Desglose por 4 materias</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
              <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-300">IA detecta tu área crítica</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300">3 preguntas de refuerzo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector & Launch Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Configurar Simulacro</span>
              </h2>
              <p className="text-xs text-slate-400">Elige la modalidad para iniciar la prueba cronometrada.</p>
            </div>
            <button
              onClick={onOpenSpec}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Ver especificación PO &rarr;
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setExamType('quick')}
              className={`p-4 rounded-xl border text-left transition-all ${
                examType === 'quick'
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Recomendado para Demo
                </span>
                <span className="text-sm font-semibold text-slate-400">8 min</span>
              </div>
              <h3 className="font-bold text-white text-base">Diagnóstico Rápido</h3>
              <p className="text-xs text-slate-400 mt-1">
                8 preguntas calibradas (2 de cada área). Ideal para probar el flujo de evaluación y el motor de IA en pocos minutos.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setExamType('standard')}
              className={`p-4 rounded-xl border text-left transition-all ${
                examType === 'standard'
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Inmersión Completa
                </span>
                <span className="text-sm font-semibold text-slate-400">15 min</span>
              </div>
              <h3 className="font-bold text-white text-base">Simulacro Extendido</h3>
              <p className="text-xs text-slate-400 mt-1">
                12 preguntas que cubren álgebra, análisis de textos, mecánica, genética y pensamiento social.
              </p>
            </button>
          </div>

          {/* Simulation Rules / Instructions */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Condiciones Reales del Protocolo:</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5">
              <li>El tiempo corre de manera regresiva sin pausa para recrear la presión de admisión.</li>
              <li>Puedes navegar entre preguntas y marcar ítems con bandera para revisión.</li>
              <li>El sistema registra el tiempo por pregunta para detectar bloqueos y vacilación.</li>
              <li>Al finalizar, el sistema calculará tu puntaje y activará el módulo tutor IA en tu materia más débil.</li>
            </ul>
          </div>

          {/* Launch Button */}
          <button
            onClick={() => onStartExam({
              totalQuestions: config.totalQuestions,
              timeLimitMinutes: config.timeLimitMinutes,
              examTitle: config.title
            })}
            className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            <span>Comenzar Simulacro ({config.totalQuestions} preguntas • {config.timeLimitMinutes} min)</span>
          </button>
        </div>

        {/* Knowledge Areas Overview */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Áreas Curriculares</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Distribución equitativa del banco:</p>

            <div className="space-y-3">
              {Object.values(SUBJECTS_INFO).map((subj) => (
                <div key={subj.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                    {subj.id === 'matematicas' && <Calculator className="w-4 h-4 text-emerald-400" />}
                    {subj.id === 'lenguaje' && <BookOpen className="w-4 h-4 text-indigo-400" />}
                    {subj.id === 'ciencias' && <Atom className="w-4 h-4 text-cyan-400" />}
                    {subj.id === 'historia' && <Globe2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{subj.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{subj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Sello IA: Analiza tu falencia y genera 3 preguntas de refuerzo adaptativo.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
