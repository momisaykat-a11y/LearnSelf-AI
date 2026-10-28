import React from "react";
import { GradeLevel, Language, SubjectId, TabId } from "../types";
import { SUBJECTS } from "../data/subjects";
import {
  BrainCircuit,
  HelpCircle,
  Calculator,
  FileText,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Flame,
} from "lucide-react";

interface SubjectGridProps {
  grade: GradeLevel;
  language: Language;
  onSelectSubject: (subId: SubjectId, targetTab: TabId) => void;
  streakCount: number;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  grade,
  language,
  onSelectSubject,
  streakCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{language === "Bengali" ? `${grade}-এর জন্য এআই লার্নিং প্ল্যাটফর্ম` : `AI Study Assistant for ${grade}`}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              {language === "Bengali"
                ? "পড়াশোনা হোক সহজ, আনন্দদায়ক ও কার্যকর!"
                : "Make Learning Clear, Interactive & Enjoyable!"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed mb-6">
              {language === "Bengali"
                ? "কঠিন বিষয়গুলোকে সহজ ভাষায় বোঝা, অংক ধাপে ধাপে মেলানো, সায়েন্স ল্যাবে পরীক্ষা করা এবং কুইজ দিয়ে পরীক্ষার সেরা প্রস্তুতি নেওয়ার সব টুলস এক সাথে।"
                : "Step-by-step problem solver, interactive STEM simulations, bite-sized revision notes, and friendly AI tutoring in English or Bengali."}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectSubject("math", "tutor")}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>{language === "Bengali" ? "টিউটরকে প্রশ্ন করো" : "Ask AI Tutor Now"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectSubject("science", "science_lab")}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <span>{language === "Bengali" ? "বিজ্ঞান ল্যাব খুলুন" : "Explore Science Lab"}</span>
              </button>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
            <img
              src="/src/assets/images/hero_study_banner_1793167963873.jpg"
              alt="LearnSelf AI Study Workspace"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-900 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === "Bengali" ? "মূল বিষয়সমূহ" : "Academic Subjects"}
            </h2>
            <p className="text-xs text-slate-500">
              {language === "Bengali" ? `${grade}-এর সিলেবাস অনুযায়ী বিষয় বেছে নাও` : `Curriculum topics mapped for ${grade}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Subject Image Thumbnail */}
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 block">
                        {grade}
                      </span>
                      <h3 className="text-lg font-bold">
                        {language === "Bengali" ? sub.nameBn : sub.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Topics Preview */}
                <div className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
                    {sub.description}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Popular Topics:
                    </span>
                    {sub.topics.slice(0, 3).map((topic, i) => (
                      <div
                        key={i}
                        className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectSubject(sub.id, "tutor")}
                  className="py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>AI Tutor</span>
                </button>

                <button
                  onClick={() => onSelectSubject(sub.id, "quiz")}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Practice Quiz</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
