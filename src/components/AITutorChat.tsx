import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, GradeLevel, Language, SubjectId } from "../types";
import { SUBJECTS } from "../data/subjects";
import {
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  AlertCircle,
} from "lucide-react";

interface AITutorChatProps {
  grade: GradeLevel;
  language: Language;
  initialSubject?: SubjectId;
  onBookmarkNote?: (title: string, content: string, subject: SubjectId) => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  grade,
  language,
  initialSubject = "math",
  onBookmarkNote,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubject);
  const [mode, setMode] = useState<"explain" | "step_by_step" | "example" | "grammar">("explain");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text:
        language === "Bengali"
          ? `স্বাগতম! আমি লার্নসেলফ AI (LearnSelf AI) — তোমার ব্যক্তিগত পড়াশোনার সহকারী। আমি ${grade}-এর গণিত, বিজ্ঞান, ইংরেজি, কম্পিউটার এবং সাধারণ জ্ঞানের যেকোনো প্রশ্ন সহজে বুঝিয়ে বলতে পারি। আজকে কোন পড়াটি নিয়ে সাহায্য করব?`
          : `Hello! I'm LearnSelf AI — your friendly study assistant for ${grade}. I can explain math problems, science concepts, English grammar, computer science, and general knowledge step-by-step with simple real-life examples. What topic would you like to explore today?`,
      timestamp: Date.now(),
      followUps: [
        "Explain Photosynthesis with a real-life example",
        "How do I solve linear equations step-by-step?",
        "What is the difference between RAM and ROM?",
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      timestamp: Date.now(),
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          subject: selectedSubject,
          grade: grade,
          language: language,
          mode: mode,
          history: messages.map((m) => ({
            sender: m.sender,
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to communicate with AI Tutor server.");
      }

      const replyText = data.reply;
      const parsedFollowUps: string[] = [];
      const followUpMatch = replyText.match(/(?:Follow-up|Check question|প্রশ্ন):?\s*([\s\S]*)$/i);
      if (followUpMatch && followUpMatch[1]) {
        const lines = followUpMatch[1].split("\n").filter((l: string) => l.trim().length > 5);
        lines.slice(0, 2).forEach((line: string) => {
          parsedFollowUps.push(line.replace(/^[0-9.\-*? ]+/, "").trim());
        });
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: replyText,
        timestamp: Date.now(),
        subject: selectedSubject,
        followUps:
          parsedFollowUps.length > 0
            ? parsedFollowUps
            : [
                language === "Bengali" ? "আরেকটি উদাহরণ দিন" : "Can you give another real-life example?",
                language === "Bengali" ? "একটি কুইজ প্রশ্ন দিন" : "Give me a practice quiz question on this",
              ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessageText =
        err?.message ||
        (language === "Bengali"
          ? "দুঃখিত, সার্ভারের সাথে সংযোগে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।"
          : "Unable to reach LearnSelf AI tutor server right now. Please try again in a moment.");

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ ${errorMessageText}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msgId);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 300) }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => fallbackBrowserSpeech(msgId, text);
        await audio.play();
        return;
      }
    } catch (e) {
      console.log("Using browser speech synthesis fallback");
    }

    fallbackBrowserSpeech(msgId, text);
  };

  const fallbackBrowserSpeech = (msgId: string, text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 400));
      utterance.lang = language === "Bengali" ? "bn-BD" : "en-US";
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioId(null);
    }
  };

  const toggleMicInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser. Please type your query!");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "Bengali" ? "bn-BD" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const activeSubjectInfo = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  const suggestedPrompts: Record<SubjectId, string[]> = {
    math: [
      "How do I add fractions with different denominators step-by-step?",
      "Explain the Pythagorean Theorem with a real-life ramp example.",
      "Solve for x: 3x + 12 = 33 with method explanation.",
    ],
    science: [
      "Explain Photosynthesis in simple steps for Class " + grade.split(" ")[1],
      "What is Ohm's Law (V = I * R) and how does electric current work?",
      "What are the parts of an atom (Protons, Neutrons, Electrons)?",
    ],
    english: [
      "What is the difference between Active and Passive Voice with examples?",
      "Explain the 8 Parts of Speech with simple everyday sentences.",
      "How to write a strong essay opening for Class " + grade.split(" ")[1] + "?",
    ],
    computer: [
      "What is the difference between CPU, RAM, and Hard Drive storage?",
      "Explain Binary numbers (0 and 1) in a fun simple way.",
      "What are AND, OR, and NOT logic gates?",
    ],
    gk: [
      "List the planets in our solar system in order from the Sun.",
      "Who invented the electric bulb and the telephone?",
      "Why does the earth have seasons (Summer, Winter)?",
    ],
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      {/* Subject & Mode Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 mb-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subject Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedSubject === s.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{language === "Bengali" ? s.nameBn : s.name}</span>
              </button>
            ))}
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setMode("explain")}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                mode === "explain"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "Bengali" ? "সহজ ব্যাখ্যা" : "Simple Explain"}
            </button>
            <button
              onClick={() => setMode("step_by_step")}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                mode === "step_by_step"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "Bengali" ? "ধাপে ধাপে সমাধান" : "Step-by-Step"}
            </button>
            <button
              onClick={() => setMode("example")}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                mode === "example"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {language === "Bengali" ? "বাস্তব উদাহরণ" : "Real Example"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 overflow-y-auto flex flex-col gap-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isAudioPlaying = playingAudioId === msg.id;
          const isError = msg.text.startsWith("⚠️");

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-3xl ${
                isUser ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : isError
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-tl-none"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      LearnSelf AI ({grade})
                    </span>

                    {!isError && (
                      <button
                        onClick={() => speakText(msg.id, msg.text)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Listen to Explanation"
                      >
                        {isAudioPlaying ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                            <span className="text-rose-500 text-[11px]">Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Follow-up Question Chips */}
                {!isUser && !isError && msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-amber-500" />
                      {language === "Bengali" ? "যাচাই প্রশ্ন / পরবর্তী প্রশ্ন:" : "Check your understanding:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-left text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          👉 {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm shadow-xs">
            <div className="w-6 h-6 rounded-full bg-indigo-600 animate-spin flex items-center justify-center text-white text-xs font-bold shrink-0">
              ⚡
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
              {language === "Bengali"
                ? "সহজ ভাষায় উত্তর তৈরি হচ্ছে..."
                : "LearnSelf AI is thinking and formulating explanation..."}
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="my-2 overflow-x-auto flex items-center gap-2 py-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          {language === "Bengali" ? "দ্রুত প্রশ্ন:" : "Quick Ideas:"}
        </span>
        {suggestedPrompts[selectedSubject].map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="relative flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <button
          onClick={toggleMicInput}
          className={`p-2.5 rounded-xl transition-colors ${
            isListening
              ? "bg-rose-500 text-white animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
          title={isListening ? "Stop Listening" : "Speak your question"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <textarea
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            language === "Bengali"
              ? `তোমার প্রশ্নটি লিখো (${grade} - ${activeSubjectInfo.nameBn})...`
              : `Ask any question in ${activeSubjectInfo.name} for ${grade}...`
          }
          className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none max-h-24 py-2"
          rows={1}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium transition-colors shadow-xs shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
