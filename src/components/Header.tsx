import React from "react";
import { GradeLevel, Language, TabId } from "../types";
import { BookOpen, Sparkles, Flame, Globe, BrainCircuit } from "lucide-react";

interface HeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  grade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  grade,
  setGrade,
  language,
  setLanguage,
  streakCount,
}) => {
  const navItems: { id: TabId; label: string; labelBn: string }[] = [
    { id: "tutor", label: "AI Tutor", labelBn: "টিউটর" },
    { id: "quiz", label: "Practice Quiz", labelBn: "কুইজ" },
    { id: "solver", label: "Math Solver", labelBn: "গণিত সমাধান" },
    { id: "science_lab", label: "Science Lab", labelBn: "বিজ্ঞান ল্যাব" },
    { id: "notes", label: "Revision Notes", labelBn: "নোটস" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveTab("tutor")}
            className="text-left font-bold text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            LearnSelf <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">AI</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap shrink-0 py-2 border-b-2 transition-all ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold"
                    : "border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300"
                }`}
              >
                {language === "Bengali" ? item.labelBn : item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Controls (Grade, Language, Streak) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Daily Streak Indicator */}
          <div
            title="Daily Study Streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakCount} {language === "Bengali" ? "দিন" : "Days"}</span>
          </div>

          {/* Grade Selector */}
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as GradeLevel)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Class 6">Class 6 (৬ষ্ঠ)</option>
            <option value="Class 7">Class 7 (৭ম)</option>
            <option value="Class 8">Class 8 (৮ম)</option>
            <option value="Class 9">Class 9 (৯ম)</option>
            <option value="Class 10">Class 10 (১০ম)</option>
          </select>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "English" ? "Bengali" : "English")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Language (English / বাংলা)"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === "English" ? "বাংলা" : "EN"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 px-2 py-2 text-xs font-medium">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${
              activeTab === item.id
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {language === "Bengali" ? item.labelBn : item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
