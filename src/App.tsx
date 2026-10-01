import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExamLobby } from './components/ExamLobby';
import { ActiveExam } from './components/ActiveExam';
import { ExamResultsView } from './components/ExamResultsView';
import { AIReinforcementModule } from './components/AIReinforcementModule';
import { TechnicalSpecView } from './components/TechnicalSpecView';
import { HistoryView } from './components/HistoryView';
import { 
  Question, 
  UserAnswerRecord, 
  ExamAttempt, 
  AreaResult, 
  SubjectId 
} from './types';
import { EXAM_BANK, SUBJECTS_INFO } from './data/mockExamBank';

const STORAGE_KEY = 'ensayo_admision_attempts_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'spec' | 'history'>('simulator');
  const [examFlow, setExamFlow] = useState<'lobby' | 'active' | 'results' | 'reinforcement'>('lobby');

  // Exam runtime state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [timeLimitSec, setTimeLimitSec] = useState<number>(600); // 10 mins
  const [activeExamTitle, setActiveExamTitle] = useState<string>('Simulacro Rápido Diagnóstico');
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [weakestAreaForReinforce, setWeakestAreaForReinforce] = useState<AreaResult | null>(null);

  // Persistent storage state
  const [attemptsHistory, setAttemptsHistory] = useState<ExamAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse attempts history from localStorage', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attemptsHistory));
    } catch (e) {
      console.error('Failed to save attempts history to localStorage', e);
    }
  }, [attemptsHistory]);

  // Handler: Start Exam
  const handleStartExam = (config: { totalQuestions: number; timeLimitMinutes: number; examTitle: string }) => {
    // Pick questions balanced across subjects
    const subjects: SubjectId[] = ['matematicas', 'lenguaje', 'ciencias', 'historia'];
    const perSubject = Math.max(1, Math.floor(config.totalQuestions / subjects.length));
    
    let selected: Question[] = [];
    subjects.forEach((subj) => {
      const subjQuestions = EXAM_BANK.filter(q => q.subjectId === subj);
      selected.push(...subjQuestions.slice(0, perSubject));
    });

    // If still need more questions to reach total, fill from remaining
    if (selected.length < config.totalQuestions) {
      const remaining = EXAM_BANK.filter(q => !selected.some(s => s.id === q.id));
      selected.push(...remaining.slice(0, config.totalQuestions - selected.length));
    }

    setActiveQuestions(selected);
    setTimeLimitSec(config.timeLimitMinutes * 60);
    setActiveExamTitle(config.examTitle);
    setExamFlow('active');
    setActiveTab('simulator');
  };

  // Handler: Finish Exam & Calculate Analytics (M2)
  const handleFinishExam = (answers: Record<string, UserAnswerRecord>, totalTimeSec: number) => {
    const totalQuestions = activeQuestions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionsSnapshot = activeQuestions.map((q) => {
      const record = answers[q.id];
      const selectedOptionId = record?.selectedOptionId || null;
      const isCorrect = selectedOptionId === q.correctOptionId;
      const timeSpent = record?.timeSpentSec || 0;

      if (selectedOptionId === null) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        question: q,
        selectedOptionId,
        isCorrect,
        timeSpentSec: timeSpent
      };
    });

    const accuracyPercentage = Math.round((correctCount / (totalQuestions || 1)) * 100);
    // Standardized score (100 - 1000 standard scale)
    const standardizedScore = Math.min(1000, Math.max(150, Math.round(150 + (correctCount / totalQuestions) * 850)));

    // Group by Area of Knowledge
    const subjectsMap: Record<SubjectId, {
      total: number;
      correct: number;
      incorrect: number;
      unanswered: number;
      totalTime: number;
      topicErrors: string[];
    }> = {
      matematicas: { total: 0, correct: 0, incorrect: 0, unanswered: 0, totalTime: 0, topicErrors: [] },
      lenguaje: { total: 0, correct: 0, incorrect: 0, unanswered: 0, totalTime: 0, topicErrors: [] },
      ciencias: { total: 0, correct: 0, incorrect: 0, unanswered: 0, totalTime: 0, topicErrors: [] },
      historia: { total: 0, correct: 0, incorrect: 0, unanswered: 0, totalTime: 0, topicErrors: [] }
    };

    questionsSnapshot.forEach((snap) => {
      const sid = snap.question.subjectId;
      subjectsMap[sid].total++;
      subjectsMap[sid].totalTime += snap.timeSpentSec;
      if (snap.selectedOptionId === null) {
        subjectsMap[sid].unanswered++;
        subjectsMap[sid].topicErrors.push(snap.question.topic);
      } else if (snap.isCorrect) {
        subjectsMap[sid].correct++;
      } else {
        subjectsMap[sid].incorrect++;
        subjectsMap[sid].topicErrors.push(snap.question.topic);
      }
    });

    const misconceptionsBySubject: Record<SubjectId, string> = {
      matematicas: 'Dificultad en resolución de ecuaciones de segundo grado y despeje algebraico.',
      lenguaje: 'Confusión en inferencias globales vs ideas secundarias explícitas en el texto.',
      ciencias: 'Vacilación en aplicación de fórmulas físicas y relaciones estequiométricas.',
      historia: 'Incertidumbre en causalidad histórica de procesos contemporáneos y ciudadanía.'
    };

    const topicsBySubject: Record<SubjectId, string> = {
      matematicas: 'Álgebra y Funciones',
      lenguaje: 'Comprensión e Inferencia Textual',
      ciencias: 'Física y Química General',
      historia: 'Historia y Formación Ciudadana'
    };

    const areaResults: AreaResult[] = (Object.keys(subjectsMap) as SubjectId[])
      .filter((sid) => subjectsMap[sid].total > 0)
      .map((sid) => {
        const data = subjectsMap[sid];
        const scorePercentage = Math.round((data.correct / (data.total || 1)) * 100);
        const avgTime = Math.round(data.totalTime / (data.total || 1));

        let status: AreaResult['status'] = 'good';
        if (scorePercentage < 50) status = 'critical';
        else if (scorePercentage < 75) status = 'needs_practice';
        else if (scorePercentage >= 90) status = 'mastered';

        return {
          subjectId: sid,
          subjectName: SUBJECTS_INFO[sid].name,
          totalQuestions: data.total,
          correctAnswers: data.correct,
          incorrectAnswers: data.incorrect,
          unanswered: data.unanswered,
          scorePercentage,
          averageTimeSec: avgTime,
          status,
          detectedMisconception: misconceptionsBySubject[sid],
          mainTopic: topicsBySubject[sid]
        };
      });

    // Detect weakest area: lowest score percentage (or highest average time if tied)
    const sortedAreas = [...areaResults].sort((a, b) => {
      if (a.scorePercentage !== b.scorePercentage) return a.scorePercentage - b.scorePercentage;
      return b.averageTimeSec - a.averageTimeSec;
    });

    const weakestArea = sortedAreas[0] || areaResults[0];

    const newAttempt: ExamAttempt = {
      id: `attempt-${Date.now()}`,
      timestamp: Date.now(),
      title: activeExamTitle,
      totalQuestions,
      totalTimeSec,
      timeLimitSec,
      correctCount,
      incorrectCount,
      unansweredCount,
      standardizedScore,
      accuracyPercentage,
      areaResults,
      weakestArea,
      questionsSnapshot,
      reinforcementCompleted: false
    };

    setCurrentAttempt(newAttempt);
    setAttemptsHistory((prev) => [newAttempt, ...prev]);
    setExamFlow('results');
  };

  // Handler: Start AI Reinforcement
  const handleStartReinforcement = (weakestArea: AreaResult) => {
    setWeakestAreaForReinforce(weakestArea);
    setExamFlow('reinforcement');
  };

  // Handler: Finish AI Reinforcement
  const handleFinishReinforcement = () => {
    if (currentAttempt) {
      const updatedAttempt = {
        ...currentAttempt,
        reinforcementCompleted: true
      };
      setCurrentAttempt(updatedAttempt);
      setAttemptsHistory((prev) => 
        prev.map(a => a.id === updatedAttempt.id ? updatedAttempt : a)
      );
    }
    setExamFlow('results');
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Seguro que deseas eliminar todos los intentos guardados?')) {
      setAttemptsHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSelectPastAttempt = (attempt: ExamAttempt) => {
    setCurrentAttempt(attempt);
    setExamFlow('results');
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Global Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'simulator' && examFlow === 'active') {
            // Keep on active exam
          }
        }}
        examInProgress={examFlow === 'active'}
        historyCount={attemptsHistory.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* TAB 1: SIMULATOR WORKFLOW */}
        {activeTab === 'simulator' && (
          <>
            {examFlow === 'lobby' && (
              <ExamLobby
                onStartExam={handleStartExam}
                onOpenSpec={() => setActiveTab('spec')}
              />
            )}

            {examFlow === 'active' && (
              <ActiveExam
                examTitle={activeExamTitle}
                questions={activeQuestions}
                timeLimitSec={timeLimitSec}
                onFinishExam={handleFinishExam}
                onCancelExam={() => {
                  if (window.confirm('¿Deseas salir del simulacro? Tus respuestas no se guardarán.')) {
                    setExamFlow('lobby');
                  }
                }}
              />
            )}

            {examFlow === 'results' && currentAttempt && (
              <ExamResultsView
                attempt={currentAttempt}
                onStartReinforcement={handleStartReinforcement}
                onRetakeExam={() => setExamFlow('lobby')}
              />
            )}

            {examFlow === 'reinforcement' && weakestAreaForReinforce && (
              <AIReinforcementModule
                weakestArea={weakestAreaForReinforce}
                examAttemptId={currentAttempt?.id || 'demo'}
                onFinishReinforcement={handleFinishReinforcement}
                onBackToResults={() => setExamFlow('results')}
              />
            )}
          </>
        )}

        {/* TAB 2: TECHNICAL & PRODUCT OWNER SPECIFICATION */}
        {activeTab === 'spec' && <TechnicalSpecView />}

        {/* TAB 3: SAVED ATTEMPTS HISTORY */}
        {activeTab === 'history' && (
          <HistoryView
            attempts={attemptsHistory}
            onSelectAttempt={handleSelectPastAttempt}
            onClearHistory={handleClearHistory}
            onStartNewExam={() => {
              setExamFlow('lobby');
              setActiveTab('simulator');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Proyecto 36 - Ensayo de Admisión</span>
            <span>•</span>
            <span>EdTech & Inteligencia Artificial</span>
          </div>
          <div className="text-slate-400">
            Diseñado para estudiantes de 3° de secundaria / bachillerato • Simulación en condiciones reales & Sello M5
          </div>
        </div>
      </footer>
    </div>
  );
}
