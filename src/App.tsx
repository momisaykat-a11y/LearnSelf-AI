import React, { useState } from "react";
import { GradeLevel, Language, SubjectId, TabId } from "./types";
import { Header } from "./components/Header";
import { SubjectGrid } from "./components/SubjectGrid";
import { AITutorChat } from "./components/AITutorChat";
import { QuizModule } from "./components/QuizModule";
import { MathWorkspace } from "./components/MathWorkspace";
import { ScienceLab } from "./components/ScienceLab";
import { RevisionNotes } from "./components/RevisionNotes";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("tutor");
  const [grade, setGrade] = useState<GradeLevel>("Class 8");
  const [language, setLanguage] = useState<Language>("English");
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("math");
  const [streakCount, setStreakCount] = useState<number>(3);

  const handleSelectSubjectFromGrid = (subId: SubjectId, targetTab: TabId) => {
    setSelectedSubject(subId);
    setActiveTab(targetTab);
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (score >= total / 2) {
      setStreakCount((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        grade={grade}
        setGrade={setGrade}
        language={language}
        setLanguage={setLanguage}
        streakCount={streakCount}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === "tutor" && (
          <AITutorChat
            grade={grade}
            language={language}
            initialSubject={selectedSubject}
          />
        )}

        {activeTab === "quiz" && (
          <QuizModule
            grade={grade}
            language={language}
            onQuizComplete={handleQuizComplete}
          />
        )}

        {activeTab === "solver" && (
          <MathWorkspace grade={grade} language={language} />
        )}

        {activeTab === "science_lab" && (
          <ScienceLab grade={grade} language={language} />
        )}

        {activeTab === "notes" && (
          <RevisionNotes grade={grade} language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LearnSelf AI — Interactive Study Assistant for Class 6–10</span>
          <span>Mathematics · Science · English · Computer Studies · General Knowledge</span>
        </div>
      </footer>
    </div>
  );
}
