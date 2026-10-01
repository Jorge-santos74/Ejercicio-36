import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Loader2, 
  RefreshCw,
  Flame,
  ChevronRight
} from 'lucide-react';
import { AreaResult, ReinforcementQuestion, ReinforcementSession } from '../types';
import { SUBJECTS_INFO } from '../data/mockExamBank';

interface AIReinforcementModuleProps {
  weakestArea: AreaResult;
  examAttemptId: string;
  onFinishReinforcement: () => void;
  onBackToResults: () => void;
}

export const AIReinforcementModule: React.FC<AIReinforcementModuleProps> = ({
  weakestArea,
  examAttemptId,
  onFinishReinforcement,
  onBackToResults
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ReinforcementQuestion[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0, 1, 2
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerVerified, setIsAnswerVerified] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompletedAll, setIsCompletedAll] = useState(false);
  const [sourceEngine, setSourceEngine] = useState<string>('gemini_api');

  const subjectInfo = SUBJECTS_INFO[weakestArea.subjectId];

  // Fetch or generate the 3 reinforcement questions from server
  useEffect(() => {
    let isMounted = true;
    const fetchReinforcement = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/reinforce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weakSubject: weakestArea.subjectName,
            weakTopic: weakestArea.mainTopic,
            failedQuestionsSummary: `El estudiante obtuvo ${weakestArea.scorePercentage}% de efectividad en ${weakestArea.subjectName}. Diagnóstico: ${weakestArea.detectedMisconception}`,
            studentGrade: '3° año de secundaria / Bachillerato (Postulante Universitario)'
          })
        });

        if (!response.ok) {
          throw new Error('Error en el servidor al generar refuerzo pedagógico.');
        }

        const data = await response.json();
        if (isMounted) {
          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions.slice(0, 3));
            setSourceEngine(data.source || 'gemini_api');
          } else {
            throw new Error('No se recibieron preguntas de refuerzo válidas.');
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Reinforce fetch error:', err);
        if (isMounted) {
          setError(err.message || 'Error de conexión con el motor pedagógico.');
          setLoading(false);
        }
      }
    };

    fetchReinforcement();

    return () => {
      isMounted = false;
    };
  }, [weakestArea]);

  const currentQ = questions[currentStepIndex];

  const handleVerifyAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerVerified(true);
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps(prev => [...prev, currentStepIndex]);
    }
  };

  const handleNextQuestion = () => {
    if (currentStepIndex < questions.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerVerified(false);
    } else {
      // Finished all 3 questions!
      setIsCompletedAll(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
          <BrainCircuit className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Analizando tu falencia en {subjectInfo.name}...
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            El motor de Inteligencia Artificial está generando 3 preguntas adaptativas personalizadas para subsanar <strong>{weakestArea.mainTopic}</strong>.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs text-indigo-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Configurando distractores psicométricos y explicaciones paso a paso...</span>
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="text-rose-400 text-lg font-bold">No se pudieron generar las preguntas</div>
        <p className="text-xs text-slate-400">{error || 'Ocurrió un error inesperado al conectar con el tutor IA.'}</p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
          >
            Reintentar Generación
          </button>
          <button
            onClick={onBackToResults}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
          >
            Volver a Resultados
          </button>
        </div>
      </div>
    );
  }

  // All 3 Completed Mastery Screen
  if (isCompletedAll) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-8 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
          <Award className="w-10 h-10 text-slate-950" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sello de Refuerzo IA Completado (3 de 3)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            ¡Felicitaciones! Has reforzado tu área más vulnerable
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Has completado las 3 preguntas adaptativas de <strong>{weakestArea.subjectName}</strong> ({weakestArea.mainTopic}) y revisado cada explicación socrática.
          </p>
        </div>

        {/* Badge Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-sm">Competencia Desbloqueada</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Estado: Consolidado</span>
          </div>
          <p className="text-xs text-slate-400">
            Los errores cometidos durante el simulacro han sido remediados. Ahora tienes una comprensión sólida del concepto nuclear y sabes cómo evitar las trampas de los distractores.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4 pt-4">
          <button
            onClick={onFinishReinforcement}
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl shadow-emerald-600/20 transition-all cursor-pointer"
          >
            Guardar en Historial y Finalizar
          </button>
          <button
            onClick={onBackToResults}
            className="px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Ver Resultados del Simulacro
          </button>
        </div>
      </div>
    );
  }

  const isOptionSelected = selectedOptionId !== null;
  const isCorrect = selectedOptionId === currentQ.correctOptionId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Stepper */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Tutor IA de Refuerzo: {subjectInfo.name}
            </h2>
            <p className="text-xs text-slate-400">
              Tema focalizado: <span className="text-slate-200 font-medium">{currentQ.topic}</span>
            </p>
          </div>
        </div>

        {/* 3 Steps Tracker (M5 constraint: must complete 3 questions) */}
        <div className="flex items-center space-x-2">
          {[0, 1, 2].map((step) => {
            const isDone = completedSteps.includes(step);
            const isCurrent = step === currentStepIndex;

            let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
            if (isDone) badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
            else if (isCurrent) badgeStyle = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/40 font-bold';

            return (
              <div
                key={step}
                className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-all ${badgeStyle}`}
              >
                {isDone ? '✓' : step + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Reinforcement Card */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-indigo-400">
            Pregunta de Refuerzo {currentStepIndex + 1} de 3
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Motor: {sourceEngine === 'gemini_api' ? 'Gemini 3.8 Flash' : 'Simulador Calibrado'}
          </span>
        </div>

        {/* Question Stem */}
        <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
          {currentQ.stem}
        </p>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isTheCorrectOne = option.id === currentQ.correctOptionId;

            let cardStyle = 'bg-slate-950/60 border-slate-800 hover:border-slate-700';
            if (isSelected) cardStyle = 'bg-indigo-600/20 border-indigo-500';

            // Post-verification styling
            if (isAnswerVerified) {
              if (isTheCorrectOne) {
                cardStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100 font-medium';
              } else if (isSelected && !isTheCorrectOne) {
                cardStyle = 'bg-rose-950/40 border-rose-500/60 text-rose-100';
              } else {
                cardStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isAnswerVerified}
                onClick={() => setSelectedOptionId(option.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer group ${cardStyle}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {option.id}
                </span>
                <span className="text-sm sm:text-base leading-relaxed pt-0.5 text-slate-200">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Button: Verify */}
        {!isAnswerVerified ? (
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!isOptionSelected}
              onClick={handleVerifyAnswer}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center space-x-2"
            >
              <span>Verificar Respuesta con Tutor IA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Post-Verification Pedagogical Deep-Dive */
          <div className="space-y-5 pt-4 animate-in fade-in duration-200 border-t border-slate-800">
            {/* Feedback Banner */}
            <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {isCorrect ? '¡Excelente razonamiento!' : 'Atención: Oportunidad de aprendizaje clave'}
                </h4>
                <p className="text-xs text-slate-300">
                  {isCorrect 
                    ? 'Has aplicado el principio correcto de manera impecable.'
                    : `La respuesta correcta era la opción ${currentQ.correctOptionId}. Analiza la resolución paso a paso:`
                  }
                </p>
              </div>
            </div>

            {/* Key Concept Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Concepto Clave a Retener</span>
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {currentQ.pedagogicalExplanation.keyConcept}
              </p>
            </div>

            {/* Step by step logic */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-indigo-400 block">
                Resolución Paso a Paso:
              </span>
              <ol className="space-y-2 pl-4 list-decimal text-slate-300">
                {currentQ.pedagogicalExplanation.stepByStep.map((stepText, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">
                    {stepText}
                  </li>
                ))}
              </ol>
            </div>

            {/* Distractor traps analysis */}
            <div className="space-y-2 text-xs pt-2">
              <span className="font-bold uppercase tracking-wider text-amber-400 block">
                ¿Por qué eran erróneos los distractores? (Trampas frecuentes):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(currentQ.pedagogicalExplanation.distractorAnalysis).map(([optKey, optExplanation]) => {
                  const isTheOne = optKey === currentQ.correctOptionId;
                  return (
                    <div 
                      key={optKey} 
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        isTheOne 
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <strong className="text-slate-200">Opción {optKey}:</strong> {optExplanation}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next question CTA */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Progreso del refuerzo: {completedSteps.length} de 3 preguntas verificadas
              </span>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>
                  {currentStepIndex < 2 ? 'Continuar a Pregunta ' + (currentStepIndex + 2) : 'Finalizar Refuerzo y Obtener Sello'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
