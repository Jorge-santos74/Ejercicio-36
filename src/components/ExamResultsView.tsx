import React, { useState } from 'react';
import { 
  Trophy, 
  Timer, 
  BarChart3, 
  Sparkles, 
  BrainCircuit, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Calculator,
  BookOpen,
  Atom,
  Globe2,
  Share2,
  RotateCcw
} from 'lucide-react';
import { ExamAttempt, AreaResult } from '../types';
import { SUBJECTS_INFO } from '../data/mockExamBank';

interface ExamResultsViewProps {
  attempt: ExamAttempt;
  onStartReinforcement: (weakestArea: AreaResult) => void;
  onRetakeExam: () => void;
}

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  attempt,
  onStartReinforcement,
  onRetakeExam
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const toggleQuestionExpand = (qId: string) => {
    setExpandedQuestionId(prev => (prev === qId ? null : qId));
  };

  const minutesSpent = Math.floor(attempt.totalTimeSec / 60);
  const secondsSpent = attempt.totalTimeSec % 60;
  const avgSecondsPerQ = Math.round(attempt.totalTimeSec / (attempt.totalQuestions || 1));

  const weakestInfo = SUBJECTS_INFO[attempt.weakestArea.subjectId];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner: Score & Performance Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          {/* Global Standardized Score */}
          <div className="space-y-2 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Puntaje Estandarizado de Admisión
            </span>
            <div className="flex items-baseline justify-center md:justify-start space-x-2">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                {attempt.standardizedScore}
              </span>
              <span className="text-slate-400 text-lg font-bold">/ 1000 pts</span>
            </div>
            <p className="text-xs text-slate-400">
              Efectividad Global: <strong className="text-emerald-400">{attempt.accuracyPercentage}%</strong> ({attempt.correctCount} de {attempt.totalQuestions} aciertos)
            </p>
          </div>

          {/* Time & Pacing Metrics (M2) */}
          <div className="space-y-3 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 flex items-center justify-center md:justify-start space-x-1.5">
              <Timer className="w-4 h-4" />
              <span>Gestión de Tiempo Real (Pacing)</span>
            </span>
            <div className="text-2xl font-bold text-white">
              {minutesSpent}m {secondsSpent}s <span className="text-xs text-slate-400 font-normal">invertidos</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Tiempo promedio por reactivo: <strong className="text-slate-200">{avgSecondsPerQ}s</strong></div>
              <div>Límite asignado: {Math.floor(attempt.timeLimitSec / 60)} minutos</div>
            </div>
          </div>

          {/* Quick Retake / Actions */}
          <div className="flex flex-col justify-center space-y-3">
            <button
              onClick={() => onStartReinforcement(attempt.weakestArea)}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Refuerzo IA para {weakestInfo.name}</span>
            </button>

            <button
              onClick={onRetakeExam}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rendir Otro Simulacro</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Area Diagnosis Hero (Core M5 feature banner) */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Diagnóstico de Falencia Cognitiva (Sello M5)</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Área Crítica Detectada: <span className="text-amber-400">{weakestInfo.name}</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El análisis psicométrico indica que en <strong>{attempt.weakestArea.mainTopic}</strong> obtuviste un rendimiento de <strong>{attempt.weakestArea.scorePercentage}%</strong>.
              <br />
              <span className="text-amber-200/90 font-medium">Diagnóstico de la IA:</span> {attempt.weakestArea.detectedMisconception}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => onStartReinforcement(attempt.weakestArea)}
              className="w-full md:w-auto px-6 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
            >
              <BrainCircuit className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Resolver 3 Preguntas de Refuerzo IA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Desglose Detallado por Área de Conocimiento */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Desglose Detallado por Área de Conocimiento</span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluación desagregada de aciertos, fallos y tiempos por asignatura.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attempt.areaResults.map((area) => {
            const subj = SUBJECTS_INFO[area.subjectId];
            const isWeakest = area.subjectId === attempt.weakestArea.subjectId;

            let statusColor = 'text-emerald-400';
            let barColor = 'bg-emerald-500';
            let statusLabel = 'Dominio Sólido';

            if (area.scorePercentage < 50) {
              statusColor = 'text-rose-400';
              barColor = 'bg-rose-500';
              statusLabel = 'Atención Prioritaria';
            } else if (area.scorePercentage < 75) {
              statusColor = 'text-amber-400';
              barColor = 'bg-amber-500';
              statusLabel = 'Refuerzo Necesario';
            }

            return (
              <div
                key={area.subjectId}
                className={`p-5 rounded-2xl border transition-all ${
                  isWeakest
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200">
                      {area.subjectId === 'matematicas' && <Calculator className="w-5 h-5 text-emerald-400" />}
                      {area.subjectId === 'lenguaje' && <BookOpen className="w-5 h-5 text-indigo-400" />}
                      {area.subjectId === 'ciencias' && <Atom className="w-5 h-5 text-cyan-400" />}
                      {area.subjectId === 'historia' && <Globe2 className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-base">{subj.name}</h4>
                        {isWeakest && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                            Área Más Débil
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{area.mainTopic}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xl font-black ${statusColor}`}>
                      {area.scorePercentage}%
                    </span>
                    <span className="block text-[10px] text-slate-400">{statusLabel}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                    style={{ width: `${Math.max(5, area.scorePercentage)}%` }}
                  />
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Aciertos:</span>
                    <span className="font-bold text-emerald-400">{area.correctAnswers} / {area.totalQuestions}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Errores:</span>
                    <span className="font-bold text-rose-400">{area.incorrectAnswers + area.unanswered}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">T. Promedio:</span>
                    <span className="font-bold text-slate-200">{area.averageTimeSec}s / ítem</span>
                  </div>
                </div>

                {/* Pedagogical Misconception Note */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-200">Enfoque:</strong> {area.detectedMisconception}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Item-by-Item Review Accordion */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Auditoría Pregunta por Pregunta</span>
        </h3>
        <p className="text-xs text-slate-400">
          Revisa las alternativas correctas y las explicaciones didácticas de cada reactivo.
        </p>

        <div className="space-y-3">
          {attempt.questionsSnapshot.map((snap, idx) => {
            const isExpanded = expandedQuestionId === snap.question.id;
            const isCorrect = snap.isCorrect;
            const subj = SUBJECTS_INFO[snap.question.subjectId];

            return (
              <div 
                key={snap.question.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleQuestionExpand(snap.question.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <span className="p-1 rounded bg-slate-800 shrink-0">
                      {snap.question.subjectId === 'matematicas' && <Calculator className="w-3.5 h-3.5 text-emerald-400" />}
                      {snap.question.subjectId === 'lenguaje' && <BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
                      {snap.question.subjectId === 'ciencias' && <Atom className="w-3.5 h-3.5 text-cyan-400" />}
                      {snap.question.subjectId === 'historia' && <Globe2 className="w-3.5 h-3.5 text-amber-400" />}
                    </span>

                    <div>
                      <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-1">
                        {snap.question.stem}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {subj.name} • {snap.question.topic} • {snap.timeSpentSec}s dedicados
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Correcta</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Incorrecta</span>
                      </span>
                    )}

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 bg-slate-950/80 border-t border-slate-800 space-y-4 text-xs sm:text-sm animate-in fade-in duration-150">
                    <div className="font-medium text-slate-100">
                      <strong>Enunciado completo:</strong> {snap.question.stem}
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase">Opciones:</div>
                      {snap.question.options.map((opt) => {
                        const isStudentChoice = snap.selectedOptionId === opt.id;
                        const isTheCorrectOne = snap.question.correctOptionId === opt.id;

                        let style = 'bg-slate-900 border-slate-800 text-slate-300';
                        if (isTheCorrectOne) {
                          style = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-medium';
                        }
                        if (isStudentChoice && !isTheCorrectOne) {
                          style = 'bg-rose-950/40 border-rose-500/50 text-rose-200';
                        }

                        return (
                          <div 
                            key={opt.id} 
                            className={`p-3 rounded-lg border flex items-center justify-between ${style}`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs w-6">{opt.id})</span>
                              <span>{opt.text}</span>
                            </div>
                            <div className="text-[11px] font-bold">
                              {isStudentChoice && !isTheCorrectOne && (
                                <span className="text-rose-400">Tu respuesta (Errónea)</span>
                              )}
                              {isTheCorrectOne && (
                                <span className="text-emerald-400">Respuesta Correcta ✓</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation Box */}
                    <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-indigo-300 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Resolución Didáctica Paso a Paso:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {snap.question.explanation}
                      </p>
                      {snap.question.tip && (
                        <div className="text-cyan-300 font-medium pt-1">
                          💡 Tip de examen: {snap.question.tip}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
