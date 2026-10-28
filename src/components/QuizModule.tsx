import React, { useState } from "react";
import { GradeLevel, Language, QuizData, QuizQuestion, SubjectId } from "../types";
import { SUBJECTS } from "../data/subjects";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface QuizModuleProps {
  grade: GradeLevel;
  language: Language;
  onQuizComplete?: (score: number, total: number) => void;
}

const DEFAULT_QUIZZES: Record<SubjectId, QuizQuestion[]> = {
  math: [
    {
      id: "q-m1",
      question: "If 3x + 5 = 20, what is the value of x?",
      options: ["x = 3", "x = 5", "x = 7", "x = 15"],
      correctIndex: 1,
      hint: "Subtract 5 from both sides of the equation first, then divide by 3.",
      explanation: "Step 1: 3x + 5 - 5 = 20 - 5  =>  3x = 15.\nStep 2: Divide both sides by 3: x = 15 / 3 = 5.",
    },
    {
      id: "q-m2",
      question: "What is the result of adding 1/3 and 1/6?",
      options: ["2/9", "1/2", "2/6", "3/6"],
      correctIndex: 1,
      hint: "Convert 1/3 into an equivalent fraction with denominator 6 (2/6).",
      explanation: "Step 1: 1/3 = 2/6.\nStep 2: 2/6 + 1/6 = 3/6.\nStep 3: Simplify 3/6 by dividing numerator & denominator by 3 = 1/2.",
    },
    {
      id: "q-m3",
      question: "In a right triangle with legs of 3 cm and 4 cm, what is the hypotenuse?",
      options: ["5 cm", "7 cm", "12 cm", "25 cm"],
      correctIndex: 0,
      hint: "Use Pythagorean formula: a² + b² = c².",
      explanation: "Step 1: 3² + 4² = 9 + 16 = 25.\nStep 2: Take square root of 25 = 5 cm.",
    },
  ],
  science: [
    {
      id: "q-s1",
      question: "Which gas do green plants absorb from the air during photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide (CO2)", "Nitrogen", "Hydrogen"],
      correctIndex: 1,
      hint: "Plants use sunlight, water, and this gas to produce glucose energy.",
      explanation: "Plants absorb Carbon Dioxide (CO2) through tiny leaf pores (stomata) and release Oxygen into the air.",
    },
    {
      id: "q-s2",
      question: "According to Ohm's Law (V = I * R), if Voltage is 12V and Resistance is 4 Ohms, what is the Current (I)?",
      options: ["48 Amperes", "8 Amperes", "3 Amperes", "16 Amperes"],
      correctIndex: 2,
      hint: "Rearrange V = I * R to I = V / R.",
      explanation: "I = V / R = 12 / 4 = 3 Amperes.",
    },
  ],
  english: [
    {
      id: "q-e1",
      question: "Which word in the following sentence is an Adverb? 'The sprinter ran very quickly.'",
      options: ["sprinter", "ran", "quickly", "very"],
      correctIndex: 2,
      hint: "Look for the word that describes HOW the sprinter ran.",
      explanation: "'Quickly' modifies the verb 'ran' to describe how the action was performed.",
    },
    {
      id: "q-e2",
      question: "What is the Passive Voice of: 'The cat chased the mouse'?",
      options: [
        "The mouse was chased by the cat.",
        "The cat was chasing the mouse.",
        "The mouse chases the cat.",
        "The mouse had been chased.",
      ],
      correctIndex: 0,
      hint: "Make the object ('the mouse') the subject of the new sentence.",
      explanation: "In passive voice, Object + was/were + past participle verb + by + subject.",
    },
  ],
  computer: [
    {
      id: "q-c1",
      question: "Which component is considered the 'Brain' of the computer system?",
      options: ["RAM Memory", "Hard Drive Storage", "Central Processing Unit (CPU)", "Graphics Card"],
      correctIndex: 2,
      hint: "It executes all mathematical instructions and program calculations.",
      explanation: "The CPU (Central Processing Unit) performs all calculations, logic execution, and system control instructions.",
    },
    {
      id: "q-c2",
      question: "What output does an AND logic gate produce if inputs are 1 and 0?",
      options: ["1 (True)", "0 (False)", "2", "Null"],
      correctIndex: 1,
      hint: "An AND gate requires BOTH inputs to be 1 to produce 1.",
      explanation: "1 AND 0 yields 0. Both inputs must be 1 for the output to be high (1).",
    },
  ],
  gk: [
    {
      id: "q-g1",
      question: "Which planet is known as the 'Red Planet' in our solar system?",
      options: ["Venus", "Jupiter", "Mars", "Saturn"],
      correctIndex: 2,
      hint: "It gets its reddish color from iron oxide (rust) on its surface.",
      explanation: "Mars is called the Red Planet due to the abundance of iron oxide on its surface soil and rocks.",
    },
  ],
};

export const QuizModule: React.FC<QuizModuleProps> = ({ grade, language, onQuizComplete }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("math");
  const [topicInput, setTopicInput] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEFAULT_QUIZZES["math"]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizTitle, setQuizTitle] = useState("Standard Diagnostic Practice Quiz");

  const activeSubjectInfo = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  const handleSubjectChange = (subId: SubjectId) => {
    setSelectedSubject(subId);
    setQuestions(DEFAULT_QUIZZES[subId] || DEFAULT_QUIZZES.math);
    setUserAnswers({});
    setShowHints({});
    setIsSubmitted(false);
    setQuizTitle(`${SUBJECTS.find((s) => s.id === subId)?.name} Quiz`);
  };

  const generateAIQuiz = async () => {
    setIsLoading(true);
    setIsSubmitted(false);
    setUserAnswers({});
    setShowHints({});

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: activeSubjectInfo.name,
          grade: grade,
          topic: topicInput || activeSubjectInfo.topics[0],
          language: language,
          count: 5,
        }),
      });

      const data: QuizData = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setQuizTitle(data.quizTitle || `${topicInput || activeSubjectInfo.name} Quiz`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate quiz. Loaded backup quiz questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const toggleHint = (qIdx: number) => {
    setShowHints((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    if (onQuizComplete) {
      onQuizComplete(correct, questions.length);
    }
  };

  const scoreCount = questions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header & Generator Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <Award className="w-4 h-4" />
              <span>
                {language === "Bengali"
                  ? `${grade}-এর জন্য অনুশীলন কুইজ`
                  : `Interactive Quiz & Practice (${grade})`}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{quizTitle}</h2>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSubjectChange(s.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === s.id
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {language === "Bengali" ? s.nameBn : s.name}
              </button>
            ))}
          </div>
        </div>

        {/* AI Custom Quiz Prompt */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder={
              language === "Bengali"
                ? `যেমন: "${activeSubjectInfo.topics[0]}"`
                : `Enter specific topic (e.g., "${activeSubjectInfo.topics[0]}")`
            }
            className="flex-1 w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={generateAIQuiz}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Generating..." : "Generate Custom AI Quiz"}</span>
          </button>
        </div>
      </div>

      {/* Score Card (after submission) */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 mb-6 shadow-md text-center flex flex-col items-center">
          <Award className="w-12 h-12 text-amber-300 mb-2 animate-bounce" />
          <h3 className="text-2xl font-extrabold">
            {scoreCount === questions.length
              ? "🎉 Perfect Score! Outstanding Job!"
              : scoreCount >= questions.length / 2
              ? "👏 Great Effort! Keep Practicing!"
              : "💪 Good Try! Review the Solutions Below."}
          </h3>
          <p className="text-sm text-indigo-100 mt-1">
            You answered <span className="font-bold text-white">{scoreCount}</span> out of{" "}
            <span className="font-bold text-white">{questions.length}</span> questions correctly!
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setUserAnswers({});
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            Try Quiz Again
          </button>
        </div>
      )}

      {/* Question List (Rule 7: Questions presented first, solutions revealed upon submit) */}
      <div className="flex flex-col gap-6">
        {questions.map((q, qIdx) => {
          const selectedOpt = userAnswers[qIdx];
          const isCorrect = selectedOpt === q.correctIndex;
          const isAnswered = selectedOpt !== undefined;

          return (
            <div
              key={q.id || qIdx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h4>
                </div>

                {!isSubmitted && q.hint && (
                  <button
                    onClick={() => toggleHint(qIdx)}
                    className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline shrink-0"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHints[qIdx] ? "Hide Hint" : "Need Hint?"}</span>
                  </button>
                )}
              </div>

              {/* Hint Box */}
              {!isSubmitted && showHints[qIdx] && q.hint && (
                <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hint: </span>
                    {q.hint}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => {
                  let optStyle =
                    "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:border-indigo-400";

                  if (selectedOpt === optIdx) {
                    optStyle =
                      "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20";
                  }

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/20";
                    } else if (selectedOpt === optIdx && optIdx !== q.correctIndex) {
                      optStyle =
                        "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      disabled={isSubmitted}
                      className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${optStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-500 flex items-center justify-center">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {opt}
                      </span>

                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && selectedOpt === optIdx && optIdx !== q.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Solution & Explanation Box (Rule 7: Revealed after submission) */}
              {isSubmitted && (
                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Step-by-Step Solution & Explanation:</span>
                  </div>
                  <div className="whitespace-pre-wrap">{q.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Action Button */}
      {!isSubmitted && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(userAnswers).length === 0}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Submit Quiz & View Step-by-Step Solutions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
