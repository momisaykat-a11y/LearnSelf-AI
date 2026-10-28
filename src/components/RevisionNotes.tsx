import React, { useState, useEffect } from "react";
import { GradeLevel, Language, RevisionNote, SubjectId } from "../types";
import { SUBJECTS } from "../data/subjects";
import {
  FileText,
  Sparkles,
  Bookmark,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Search,
  Download,
} from "lucide-react";

interface RevisionNotesProps {
  grade: GradeLevel;
  language: Language;
}

export const RevisionNotes: React.FC<RevisionNotesProps> = ({ grade, language }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("science");
  const [topicInput, setTopicInput] = useState("");
  const [currentNote, setCurrentNote] = useState<RevisionNote | null>(null);
  const [savedNotes, setSavedNotes] = useState<RevisionNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const loaded =
        localStorage.getItem("learnself_saved_notes") || localStorage.getItem("shiksho_saved_notes");
      if (loaded) {
        setSavedNotes(JSON.parse(loaded));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleGenerateNotes = async (topicToGen?: string) => {
    const topic = topicToGen || topicInput;
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/notes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          subject: selectedSubject,
          grade: grade,
          language: language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const noteObj: RevisionNote = {
        id: `note-${Date.now()}`,
        topicTitle: data.topicTitle || topic,
        grade: grade,
        subject: selectedSubject,
        summaryOverview: data.summaryOverview || "",
        keyConcepts: data.keyConcepts || [],
        formulasOrRules: data.formulasOrRules || [],
        realLifeExamples: data.realLifeExamples || [],
        commonPitfalls: data.commonPitfalls || [],
        recallQuestions: data.recallQuestions || [],
        createdAt: Date.now(),
      };

      setCurrentNote(noteObj);
    } catch (e: any) {
      console.error(e);
      alert("Failed to generate revision note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentNote = () => {
    if (!currentNote) return;
    const updated = [currentNote, ...savedNotes.filter((n) => n.id !== currentNote.id)];
    setSavedNotes(updated);
    localStorage.setItem("learnself_saved_notes", JSON.stringify(updated));
    alert("Saved to your Revision Bookshelf!");
  };

  const deleteSavedNote = (id: string) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(updated);
    localStorage.setItem("learnself_saved_notes", JSON.stringify(updated));
  };

  const activeSubjectInfo = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header & Generator Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
              <FileText className="w-4 h-4" />
              <span>{language === "Bengali" ? `পরীক্ষার নোটিশ ও রিভিশন শিট (${grade})` : `Exam Cheat Sheet & Revision Notes (${grade})`}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {language === "Bengali" ? "যেকোনো টপিকের সংক্ষিপ্ত সারসংক্ষেপ তৈরি করো" : "Generate Instant Concept Summaries"}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
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

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerateNotes()}
            placeholder={
              language === "Bengali"
                ? `টপিক লিখো (যেমন: "${activeSubjectInfo.topics[0]}")`
                : `Enter any topic (e.g. "${activeSubjectInfo.topics[0]}")`
            }
            className="flex-1 w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
          <button
            onClick={() => handleGenerateNotes()}
            disabled={!topicInput.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? "Generating Summary..." : "Generate Revision Sheet"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Note Sheet (2 Cols) */}
        <div className="lg:col-span-2">
          {isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Crafting concise exam revision sheet for {grade}...
              </p>
            </div>
          )}

          {currentNote && !isLoading && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-6">
              {/* Note Header & Save Button */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                    {currentNote.subject} · {currentNote.grade}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {currentNote.topicTitle}
                  </h3>
                </div>

                <button
                  onClick={saveCurrentNote}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
              </div>

              {/* Summary Overview */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  1. Overview Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  {currentNote.summaryOverview}
                </p>
              </div>

              {/* Key Concepts */}
              {currentNote.keyConcepts.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    2. Core Concepts
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {currentNote.keyConcepts.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formulas & Rules */}
              {currentNote.formulasOrRules.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    3. Formulas / Key Rules
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentNote.formulasOrRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-xs font-mono font-bold text-indigo-900 dark:text-indigo-200"
                      >
                        📌 {rule}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pitfalls & Exam Mistakes */}
              {currentNote.commonPitfalls.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>4. Common Pitfalls to Avoid in Exams</span>
                  </h4>
                  <div className="space-y-2">
                    {currentNote.commonPitfalls.map((pitfall, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200"
                      >
                        ⚠️ {pitfall}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Recall Questions */}
              {currentNote.recallQuestions.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    5. Quick Self-Recall Questions
                  </h4>
                  <div className="space-y-3">
                    {currentNote.recallQuestions.map((rq, idx) => (
                      <details
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
                      >
                        <summary className="font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span>Q{idx + 1}: {rq.question}</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline">
                            Reveal Answer
                          </span>
                        </summary>
                        <p className="mt-2 text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700">
                          {rq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!currentNote && !isLoading && (
            <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
              <FileText className="w-12 h-12 text-slate-400 mb-2" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No note selected
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter a topic above or select one from your saved bookshelf to view the revision summary!
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Saved Bookshelf */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs h-fit">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              <span>Saved Bookshelf ({savedNotes.length})</span>
            </span>
          </h3>

          {savedNotes.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No saved revision notes yet. Click "Save Note" on any generated summary!
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setCurrentNote(note)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    currentNote?.id === note.id
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                      {note.subject} · {note.grade}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {note.topicTitle}
                    </h5>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedNote(note.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
