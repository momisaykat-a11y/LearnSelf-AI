export type GradeLevel = "Class 6" | "Class 7" | "Class 8" | "Class 9" | "Class 10";

export type SubjectId = "math" | "science" | "english" | "computer" | "gk";

export type Language = "English" | "Bengali";

export type TabId = "tutor" | "quiz" | "solver" | "science_lab" | "notes";

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  nameBn: string;
  description: string;
  image: string;
  topics: string[];
  color: string;
  lightBg: string;
  borderColor: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: number;
  subject?: SubjectId;
  audioUrl?: string;
  followUps?: string[];
  mode?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface QuizData {
  quizTitle: string;
  subject?: string;
  grade?: string;
  questions: QuizQuestion[];
}

export interface MathStep {
  stepNumber: number;
  title: string;
  explanation: string;
  calculation?: string;
}

export interface MathSolution {
  problemTitle: string;
  givenData?: string[];
  formulaUsed?: string;
  steps: MathStep[];
  finalAnswer: string;
  verificationTip?: string;
  similarPracticeProblem?: string;
}

export interface RecallQuestion {
  question: string;
  answer: string;
}

export interface RevisionNote {
  id: string;
  topicTitle: string;
  grade: string;
  subject: string;
  summaryOverview: string;
  keyConcepts: string[];
  formulasOrRules: string[];
  realLifeExamples: string[];
  commonPitfalls: string[];
  recallQuestions: RecallQuestion[];
  createdAt: number;
}
