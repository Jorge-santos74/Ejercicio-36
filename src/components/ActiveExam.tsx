import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Calculator,
  BookOpen,
  Atom,
  Globe2,
  X
} from 'lucide-react';
import { Question, UserAnswerRecord } from '../types';
import { SUBJECTS_INFO } from '../data/mockExamBank';

interface ActiveExamProps {
  examTitle: string;
  questions: Question[];
  timeLimitSec: number;
  onFinishExam: (answers: Record<string, UserAnswerRecord>, totalTimeSec: number) => void;
  onCancelExam: () => void;
}

export const ActiveExam: React.FC<ActiveExamProps> = ({
  examTitle,
  questions,
  timeLimitSec,
  onFinishExam,
  onCancelExam
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemainingSec, setTimeRemainingSec] = useState(timeLimitSec);
  const [answers, setAnswers] = useState<Record<string, UserAnswerRecord>>(() => {
    const initial: Record<string, UserAnswerRecord> = {};
    questions.forEach((q) => {
      initial[q.id] = {
        selectedOptionId: null,
        timeSpentSec: 0,
        isMarkedForReview: false
      };
    });
    return initial;
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const currentQuestionStartTime = useRef<number>(Date.now());
  const timerRef = useRef<any>(null);

  // Global countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update time spent on previous question when switching index
  const updateCurrentQuestionTime = () => {
    const now = Date.now();
    const elapsedSec = Math.round((now - currentQuestionStartTime.current) / 1000);
    const currentQId = questions[currentIndex].id;

    setAnswers((prev) => ({
      ...prev,
      [currentQId]: {
        ...prev[currentQId],
        timeSpentSec: (prev[currentQId]?.timeSpentSec || 0) + elapsedSec
      }
    }));
    currentQuestionStartTime.current = now;
  };

  const goToQuestion = (index: number) => {
    updateCurrentQuestionTime();
    setCurrentIndex(index);
  };

  const handleSelectOption = (optionId: string) => {
    const currentQId = questions[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [currentQId]: {
        ...prev[currentQId],
        selectedOptionId: optionId
      }
    }));
  };

  const handleToggleFlag = () => {
    const currentQId = questions[currentIndex].id;
    setAnswers((prev) => ({
      ...prev,
      [currentQId]: {
        ...prev[currentQId],
        isMarkedForReview: !prev[currentQId]?.isMarkedForReview
      }
    }));
  };

  const handleTimeExpired = () => {
    updateCurrentQuestionTime();
    // Auto-submit
    const totalTime = timeLimitSec;
    onFinishExam(answers, totalTime);
  };

  const handleExplicitSubmit = () => {
    updateCurrentQuestionTime();
    const totalTime = timeLimitSec - timeRemainingSec;
    onFinishExam(answers, totalTime);
  };

  const currentQuestion = questions[currentIndex];
  const currentRecord = answers[currentQuestion.id] || {
    selectedOptionId: null,
    timeSpentSec: 0,
    isMarkedForReview: false
  };

  const answeredCount = Object.values(answers).filter((a) => a.selectedOptionId !== null).length;
  const flaggedCount = Object.values(answers).filter((a) => a.isMarkedForReview).length;
  const unansweredCount = questions.length - answeredCount;

  // Formatting minutes and seconds
  const minutes = Math.floor(timeRemainingSec / 60);
  const seconds = timeRemainingSec % 60;
  const isTimeCritical = timeRemainingSec < 120; // under 2 mins

  const subjectInfo = SUBJECTS_INFO[currentQuestion.subjectId];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sticky top-20 z-30 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Exam Title & Progress */}
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs border border-indigo-500/30">
            Pregunta {currentIndex + 1} de {questions.length}
          </div>
          <span className="text-sm font-semibold text-slate-200 hidden md:inline truncate max-w-xs">
            {examTitle}
          </span>
        </div>

        {/* Global Countdown Timer */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-base font-bold border transition-colors ${
          isTimeCritical 
            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
            : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}>
          <Timer className={`w-5 h-5 ${isTimeCritical ? 'text-rose-400' : 'text-amber-400'}`} />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 font-sans uppercase">restantes</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Finalizar Ensayo
          </button>
          <button
            onClick={onCancelExam}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Cancelar y salir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Question + Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Question Stem & Options (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Subject and Topic Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                  {currentQuestion.subjectId === 'matematicas' && <Calculator className="w-4 h-4 text-emerald-400" />}
                  {currentQuestion.subjectId === 'lenguaje' && <BookOpen className="w-4 h-4 text-indigo-400" />}
                  {currentQuestion.subjectId === 'ciencias' && <Atom className="w-4 h-4 text-cyan-400" />}
                  {currentQuestion.subjectId === 'historia' && <Globe2 className="w-4 h-4 text-amber-400" />}
                </span>
                <span className="text-xs font-bold text-slate-200">{subjectInfo.name}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{currentQuestion.topic}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  Dificultad: {currentQuestion.difficulty}
                </span>
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    currentRecord.isMarkedForReview
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${currentRecord.isMarkedForReview ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{currentRecord.isMarkedForReview ? 'Marcada con Duda' : 'Marcar para revisión'}</span>
                </button>
              </div>
            </div>

            {/* Question Stem */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                {currentQuestion.stem}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = currentRecord.selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {option.id}
                    </span>
                    <span className={`text-sm sm:text-base leading-relaxed pt-0.5 ${
                      isSelected ? 'text-white font-medium' : 'text-slate-300'
                    }`}>
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="text-xs text-slate-400">
                Tiempo sugerido para este ítem: ~{currentQuestion.recommendedTimeSec}s
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToQuestion(currentIndex + 1)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Revisar y Entregar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Question Navigation Palette (1 col) */}
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Navegador de Preguntas
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Respondida</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Duda</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span>Pendiente</span>
              </div>
            </div>

            {/* Questions Grid Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const record = answers[q.id];
                const isSelected = idx === currentIndex;
                const isAnswered = record?.selectedOptionId !== null;
                const isFlagged = record?.isMarkedForReview;

                let btnStyle = 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700';
                if (isAnswered) {
                  btnStyle = 'bg-indigo-600 text-white border-indigo-500 font-bold';
                }
                if (isFlagged) {
                  btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold';
                }
                if (isSelected) {
                  btnStyle += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => goToQuestion(idx)}
                    className={`h-10 rounded-xl text-xs flex items-center justify-center border transition-all cursor-pointer relative ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary statistics */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Respondidas:</span>
                <span className="font-bold text-indigo-400">{answeredCount} de {questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Con marca de duda:</span>
                <span className="font-bold text-amber-400">{flaggedCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sin responder:</span>
                <span className={`font-bold ${unansweredCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {unansweredCount}
                </span>
              </div>
            </div>

            {/* Quick Submit CTA */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Entregar Ensayo
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">¿Finalizar el Simulacro?</h3>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <p>
                Estás a punto de entregar tus respuestas para el cálculo del puntaje oficial y el diagnóstico pedagógico por áreas de conocimiento.
              </p>

              {unansweredCount > 0 ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  ⚠️ Atención: Tienes <strong>{unansweredCount}</strong> {unansweredCount === 1 ? 'pregunta' : 'preguntas'} sin responder. En una prueba real, las preguntas en blanco no suman puntaje.
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  ✅ ¡Excelente! Has respondido el 100% de las preguntas ({questions.length}/{questions.length}).
                </div>
              )}

              <p className="text-xs text-slate-400">
                Tiempo restante en el cronómetro: <strong>{minutes}m {seconds}s</strong>.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Volver al Examen
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  handleExplicitSubmit();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
              >
                Confirmar y Ver Diagnóstico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
