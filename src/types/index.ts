export type SubjectId = 'matematicas' | 'lenguaje' | 'ciencias' | 'historia';

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  accentBg: string;
  accentBorder: string;
  description: string;
}

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  topic: string;
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  tip?: string;
  recommendedTimeSec: number;
  difficulty: 'fácil' | 'medio' | 'difícil';
}

export interface UserAnswerRecord {
  selectedOptionId: string | null;
  timeSpentSec: number;
  isMarkedForReview: boolean;
}

export interface AreaResult {
  subjectId: SubjectId;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scorePercentage: number;
  averageTimeSec: number;
  status: 'critical' | 'needs_practice' | 'good' | 'mastered';
  detectedMisconception: string;
  mainTopic: string;
}

export interface ExamAttempt {
  id: string;
  timestamp: number;
  title: string;
  totalQuestions: number;
  totalTimeSec: number;
  timeLimitSec: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  standardizedScore: number; // 100 - 1000
  accuracyPercentage: number;
  areaResults: AreaResult[];
  weakestArea: AreaResult;
  questionsSnapshot: Array<{
    question: Question;
    selectedOptionId: string | null;
    isCorrect: boolean;
    timeSpentSec: number;
  }>;
  reinforcementCompleted?: boolean;
}

export interface ReinforcementQuestion {
  id: string;
  topic: string;
  stem: string;
  options: QuestionOption[];
  correctOptionId: string;
  pedagogicalExplanation: {
    keyConcept: string;
    stepByStep: string[];
    distractorAnalysis: Record<string, string>;
  };
}

export interface ReinforcementSession {
  examAttemptId: string;
  targetSubject: string;
  targetTopic: string;
  questions: ReinforcementQuestion[];
  userAnswers: Record<string, string>; // questionId -> selectedOptionId
  completedQuestions: string[]; // questionIds completed
  isMastered: boolean;
}

// Architecture & Product Spec Data Models
export interface UserJourneyStep {
  stepNumber: number;
  phase: string;
  userGoal: string;
  actions: string[];
  systemResponse: string[];
  emotionalState: 'ansioso' | 'concentrado' | 'evaluativo' | 'receptivo' | 'motivado';
  kpis: string[];
  painPointsResolved: string;
}

export interface DatabaseField {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DatabaseEntity {
  name: string;
  tableName: string;
  description: string;
  category: 'core' | 'exam' | 'analytics' | 'ai';
  fields: DatabaseField[];
  indexes: string[];
  businessLogicNotes: string[];
}

export interface SystemPromptTemplate {
  name: string;
  role: string;
  description: string;
  systemInstructionText: string;
  inputVariables: Array<{ name: string; type: string; example: string; description: string }>;
  expectedOutputSchema: string;
  fewShotExample: {
    input: string;
    output: string;
  };
}

export interface WireframeSection {
  id: string;
  title: string;
  viewName: string;
  userObjective: string;
  visualHierarchy: string[];
  uxDesignRules: string[];
  layoutDescription: string;
}
