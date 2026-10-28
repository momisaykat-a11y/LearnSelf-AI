import React, { useState } from "react";
import { GradeLevel, Language, MathSolution } from "../types";
import { PRESET_MATH_PROBLEMS } from "../data/subjects";
import {
  Calculator,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Scale,
  Lightbulb,
} from "lucide-react";

interface MathWorkspaceProps {
  grade: GradeLevel;
  language: Language;
}

export const MathWorkspace: React.FC<MathWorkspaceProps> = ({ grade, language }) => {
  const [problemInput, setProblemInput] = useState("");
  const [solution, setSolution] = useState<MathSolution | null>({
    problemTitle: "Solve Linear Equation: 3x + 7 = 22",
    givenData: ["Equation: 3x + 7 = 22", "Variable to solve: x"],
    formulaUsed: "Balance Method: Perform identical arithmetic operations on both sides of the equation.",
    steps: [
      {
        stepNumber: 1,
        title: "Isolate the variable term (3x)",
        explanation:
          "To get 3x by itself, subtract 7 from both sides of the equals sign (=) to keep the equation balanced.",
        calculation: "3x + 7 - 7 = 22 - 7  =>  3x = 15",
      },
      {
        stepNumber: 2,
        title: "Divide by the coefficient of x (3)",
        explanation:
          "Since x is multiplied by 3, divide both sides by 3 to find the value of 1x.",
        calculation: "(3x) / 3 = 15 / 3  =>  x = 5",
      },
    ],
    finalAnswer: "x = 5",
    verificationTip: "Check by plugging x = 5 back into original equation: 3(5) + 7 = 15 + 7 = 22. Correct!",
    similarPracticeProblem: "Try solving: 4x + 9 = 33. What is x?",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSolve = async (customProblem?: string) => {
    const textToSolve = customProblem || problemInput;
    if (!textToSolve.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/math/solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemText: textToSolve,
          grade: grade,
          language: language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Solving failed");
      setSolution(data);
    } catch (e: any) {
      console.error(e);
      alert("Failed to solve problem. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
          <Calculator className="w-4 h-4" />
          <span>{language === "Bengali" ? `ধাপে ধাপে সমাধানকারী (${grade})` : `Step-by-Step Problem Solver (${grade})`}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {language === "Bengali"
            ? "যে কোনো গণিত বা বিজ্ঞানের সমস্যা ধাপে ধাপে শিখো"
            : "Master Mathematics & Science Method Step-by-Step"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          {language === "Bengali"
            ? "শুধু উত্তর নয়, কীভাবে এবং কোন নিয়মে অংকটি সমাধান করা হয়েছে তার প্রতিটি ধাপ সহজ ভাষায় চিত্রসহ দেখানো হবে।"
            : "LearnSelf AI doesn't just give you the final number — it explains the exact formula, balance logic, and mental steps so you can solve it yourself in exams!"}
        </p>

        {/* Problem Input & Solve Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={problemInput}
              onChange={(e) => setProblemInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSolve()}
              placeholder={
                language === "Bengali"
                  ? "যেমন: 4x + 10 = 30 বা 3/4 + 2/5"
                  : "Type any equation, fraction, ratio, or word problem..."
              }
              className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>
          <button
            onClick={() => handleSolve()}
            disabled={!problemInput.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Solving Step-by-Step..." : "Explain Method"}</span>
          </button>
        </div>

        {/* Preset Problem Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-400 shrink-0">Try preset:</span>
          {PRESET_MATH_PROBLEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProblemInput(p.problemText);
                handleSolve(p.problemText);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-3"></div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Analyzing Math Logic & Balance Steps...
          </h4>
          <p className="text-xs text-slate-500 mt-1">Generating clear explanation for {grade}</p>
        </div>
      )}

      {/* Solution Visual Deck */}
      {solution && !isLoading && (
        <div className="flex flex-col gap-6">
          {/* Solution Summary Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              {solution.problemTitle}
            </h3>

            {/* Formula / Rule Box */}
            {solution.formulaUsed && (
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 mb-4 flex items-start gap-3">
                <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block mb-0.5">
                    Core Rule / Formula Used:
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-indigo-800 dark:text-indigo-200">
                    {solution.formulaUsed}
                  </p>
                </div>
              </div>
            )}

            {/* Steps Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Step-by-Step Breakdown
              </h4>

              {solution.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {step.title}
                    </h5>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {step.explanation}
                  </p>

                  {step.calculation && (
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
                      {step.calculation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final Answer Highlight Box */}
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wide">Final Answer:</span>
              </div>
              <span className="text-base sm:text-lg font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                {solution.finalAnswer}
              </span>
            </div>

            {/* Verification & Similar Practice Tip */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {solution.verificationTip && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                    How to verify in exams:
                  </span>
                  <p>{solution.verificationTip}</p>
                </div>
              )}

              {solution.similarPracticeProblem && (
                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-sky-600" />
                    Self-test challenge:
                  </span>
                  <p>{solution.similarPracticeProblem}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
