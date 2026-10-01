import React from 'react';
import { 
  History, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Timer, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { ExamAttempt } from '../types';
import { SUBJECTS_INFO } from '../data/mockExamBank';

interface HistoryViewProps {
  attempts: ExamAttempt[];
  onSelectAttempt: (attempt: ExamAttempt) => void;
  onClearHistory: () => void;
  onStartNewExam: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  attempts,
  onSelectAttempt,
  onClearHistory,
  onStartNewExam
}) => {
  if (attempts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <History className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">No tienes ensayos guardados aún</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Rinde tu primer simulacro cronometrado para registrar tu evolución, diagnosticar tus debilidades y recibir el refuerzo con IA.
          </p>
        </div>
        <button
          onClick={onStartNewExam}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
        >
          Iniciar mi primer simulacro
        </button>
      </div>
    );
  }

  // Calculate statistics across attempts
  const highestScore = Math.max(...attempts.map(a => a.standardizedScore));
  const latestScore = attempts[0]?.standardizedScore || 0;
  const totalSimulations = attempts.length;
  const reinforcedCount = attempts.filter(a => a.reinforcementCompleted).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-400" />
            <span>Historial de Simulacros Persistidos (M2)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Registro de todos tus intentos de admisión con puntajes, tiempos y estado del refuerzo IA.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onStartNewExam}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
          >
            Nuevo Simulacro
          </button>
          <button
            onClick={onClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Borrar historial"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase">Ensayos Rendidos</span>
          <div className="text-2xl font-black text-white">{totalSimulations}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase">Puntaje Máximo</span>
          <div className="text-2xl font-black text-emerald-400">{highestScore} pts</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase">Último Puntaje</span>
          <div className="text-2xl font-black text-indigo-400">{latestScore} pts</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] uppercase">Refuerzos IA Completados</span>
          <div className="text-2xl font-black text-amber-400">{reinforcedCount} de {totalSimulations}</div>
        </div>
      </div>

      {/* List of attempts */}
      <div className="space-y-3">
        {attempts.map((attempt) => {
          const weakestInfo = SUBJECTS_INFO[attempt.weakestArea.subjectId];
          const dateStr = new Date(attempt.timestamp).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          const minutes = Math.floor(attempt.totalTimeSec / 60);
          const seconds = attempt.totalTimeSec % 60;

          return (
            <div
              key={attempt.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-base">{attempt.title}</h3>
                  {attempt.reinforcementCompleted ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Refuerzo IA Completado</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Sparkles className="w-3 h-3" />
                      <span>Refuerzo Pendiente</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dateStr}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Timer className="w-3.5 h-3.5 text-slate-500" />
                    <span>{minutes}m {seconds}s dedicados</span>
                  </span>
                  <span>•</span>
                  <span>
                    Área crítica: <strong className="text-amber-400">{weakestInfo.name}</strong> ({attempt.weakestArea.scorePercentage}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end md:self-center">
                <div className="text-right">
                  <div className="text-2xl font-black text-white">
                    {attempt.standardizedScore} <span className="text-xs font-normal text-slate-400">/ 1000</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {attempt.accuracyPercentage}% efectividad
                  </span>
                </div>

                <button
                  onClick={() => onSelectAttempt(attempt)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <span>Ver Detalle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
