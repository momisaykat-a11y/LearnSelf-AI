import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI SDK with environment key
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Primary supported Flash models for free tier reliability
const PRIMARY_MODEL = "gemini-3.1-flash-lite";
const FALLBACK_MODEL = "gemini-3.8-flash";
const TTS_MODEL = "gemini-3.8-flash-lite-tts";

// Robust helper to generate content with automatic fallback
async function generateGeminiContent(params: any) {
  try {
    return await ai.models.generateContent({
      ...params,
      model: params.model || PRIMARY_MODEL,
    });
  } catch (primaryErr: any) {
    console.warn(`Primary model (${params.model || PRIMARY_MODEL}) error:`, primaryErr?.message);
    // If primary model failed, retry with fallback model
    if ((params.model || PRIMARY_MODEL) !== FALLBACK_MODEL) {
      console.log(`Retrying with fallback model (${FALLBACK_MODEL})...`);
      return await ai.models.generateContent({
        ...params,
        model: FALLBACK_MODEL,
      });
    }
    throw primaryErr;
  }
}

// 1. AI Tutor Chat Endpoint
app.post("/api/tutor/chat", async (req: Request, res: Response) => {
  try {
    const { message, subject, grade, language, mode, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Please enter a valid question or study topic." });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured in the server environment." });
    }

    const currentGrade = grade || "Class 8";
    const currentLang = language === "Bengali" ? "Simple Bengali (সহজ বাংলা)" : "English";
    const currentSubject = subject || "General Studies";

    const systemInstruction = `You are LearnSelf AI, a warm, encouraging, patient, and expert AI Study Assistant tailored for ${currentGrade} students studying ${currentSubject}.

Your Core Teaching Philosophy & Rules:
1. EXPLAIN SIMPLY: Explain difficult concepts using clear language suitable for a ${currentGrade} student.
2. STEP-BY-STEP: Break complicated topics into small, sequential steps.
3. REAL-LIFE EXAMPLES: Always connect theories, math formulas, or scientific laws to relatable real-life examples.
4. FOLLOW-UP QUESTIONS: End every single response with 1-2 short, friendly follow-up questions to check if the student understood or wants to try a quick practice.
5. NO SHAMING: Be extremely supportive. Never make a student feel bad for asking simple or basic questions.
6. METHOD OVER ANSWERS: When helping with math, physics, or problem-solving, explain the method and step-by-step logic. Do not just blurt out the final answer.
7. CRITICAL THINKING: Prompt the student to think independently (e.g., "What do you think happens when...?").
8. LANGUAGE: Respond in ${currentLang}. If Bengali is requested, write natural, easy-to-read Bengali (সহজ ও সাবলীল বাংলা).
9. UNCERTAINTY: If you are unsure about a fact or question, admit it honestly instead of guessing.
10. MODE DIRECTIVE: Current requested mode is "${mode || "explain"}". Adapt tone (e.g., step-by-step solver, grammar breakdown, or simple conceptual story).`;

    // Sanitize and format chat history safely
    const contents: any[] = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-6)) {
        const textContent = typeof item.content === "string" ? item.content : item.text || item.parts?.[0]?.text;
        if (textContent && textContent.trim()) {
          contents.push({
            role: item.role === "assistant" || item.sender === "assistant" ? "model" : "user",
            parts: [{ text: textContent.trim() }],
          });
        }
      }
    }

    // Append current user query
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    const response = await generateGeminiContent({
      model: PRIMARY_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm ready to help! Could you rephrase your question?";
    return res.json({ reply: replyText, modelUsed: PRIMARY_MODEL, success: true });
  } catch (err: any) {
    console.error("Tutor Chat Server Error:", err);

    let clientErrorMsg = "Unable to generate response right now. Please try asking again.";
    if (err?.status === 429 || err?.message?.includes("quota")) {
      clientErrorMsg = "API quota rate limit reached. Please wait a moment before asking your next question.";
    } else if (err?.status === 401 || err?.status === 403) {
      clientErrorMsg = "API authentication error. Please verify GEMINI_API_KEY setup.";
    }

    return res.status(500).json({
      error: clientErrorMsg,
      details: err?.message || String(err),
    });
  }
});

// 2. Quiz Generator Endpoint
app.post("/api/quiz/generate", async (req: Request, res: Response) => {
  try {
    const { subject, grade, topic, language, count } = req.body;
    const numQuestions = Math.min(Math.max(count || 5, 1), 10);
    const currentGrade = grade || "Class 8";
    const currentLang = language === "Bengali" ? "Bengali" : "English";

    const prompt = `Create a ${numQuestions}-question multiple choice quiz for ${currentGrade} on the subject "${subject}" specifically covering topic: "${topic || "General Core Knowledge"}". 
Language for questions and explanations: ${currentLang}.
Make sure questions match the difficulty level of ${currentGrade}. 
Include a helpful hint and a clear step-by-step explanation for why the correct answer is right.`;

    const response = await generateGeminiContent({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quizTitle: { type: Type.STRING },
            subject: { type: Type.STRING },
            grade: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER, description: "Zero-based index (0, 1, 2, or 3) of correct option" },
                  hint: { type: Type.STRING, description: "A gentle hint that guides without giving the answer away" },
                  explanation: { type: Type.STRING, description: "Detailed step-by-step explanation" },
                },
                required: ["id", "question", "options", "correctIndex", "hint", "explanation"],
              },
            },
          },
          required: ["quizTitle", "questions"],
        },
      },
    });

    const quizData = JSON.parse(response.text || "{}");
    return res.json(quizData);
  } catch (err: any) {
    console.error("Quiz Gen Server Error:", err);
    return res.status(500).json({ error: "Could not generate quiz at this moment.", details: err?.message });
  }
});

// 3. Step-by-step Math & Problem Solver Endpoint
app.post("/api/math/solver", async (req: Request, res: Response) => {
  try {
    const { problemText, grade, language } = req.body;

    if (!problemText || typeof problemText !== "string" || !problemText.trim()) {
      return res.status(400).json({ error: "Problem text is required." });
    }

    const currentGrade = grade || "Class 8";
    const currentLang = language === "Bengali" ? "Bengali" : "English";

    const prompt = `Solve this mathematics/science problem step-by-step for a ${currentGrade} student: "${problemText}".
Language: ${currentLang}.
Break it into distinct logical steps. Explain the core formula/rule used, what each step means, and give a visual/conceptual mental model if applicable.`;

    const response = await generateGeminiContent({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemTitle: { type: Type.STRING },
            givenData: { type: Type.ARRAY, items: { type: Type.STRING } },
            formulaUsed: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  calculation: { type: Type.STRING },
                },
                required: ["stepNumber", "title", "explanation"],
              },
            },
            finalAnswer: { type: Type.STRING },
            verificationTip: { type: Type.STRING },
            similarPracticeProblem: { type: Type.STRING },
          },
          required: ["problemTitle", "steps", "finalAnswer"],
        },
      },
    });

    const solutionData = JSON.parse(response.text || "{}");
    return res.json(solutionData);
  } catch (err: any) {
    console.error("Math Solver Server Error:", err);
    return res.status(500).json({ error: "Failed to solve problem.", details: err?.message });
  }
});

// 4. Revision Notes Generator Endpoint
app.post("/api/notes/generate", async (req: Request, res: Response) => {
  try {
    const { topic, subject, grade, language } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const currentGrade = grade || "Class 8";
    const currentLang = language === "Bengali" ? "Bengali" : "English";

    const prompt = `Create a quick-revision cheat sheet and study summary on the topic "${topic}" (Subject: ${subject || "General"}, Grade: ${currentGrade}).
Language: ${currentLang}.
Include concise key concepts, crucial formulas or rules, real-life applications, common mistakes students make in exams, and 3 quick recall questions with answers.`;

    const response = await generateGeminiContent({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topicTitle: { type: Type.STRING },
            grade: { type: Type.STRING },
            subject: { type: Type.STRING },
            summaryOverview: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            formulasOrRules: { type: Type.ARRAY, items: { type: Type.STRING } },
            realLifeExamples: { type: Type.ARRAY, items: { type: Type.STRING } },
            commonPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
            recallQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
          required: ["topicTitle", "summaryOverview", "keyConcepts"],
        },
      },
    });

    const notesData = JSON.parse(response.text || "{}");
    return res.json(notesData);
  } catch (err: any) {
    console.error("Notes Gen Server Error:", err);
    return res.status(500).json({ error: "Failed to generate revision notes.", details: err?.message });
  }
});

// 5. Speech Synthesis / Text-to-Speech Endpoint
app.post("/api/tts", async (req: Request, res: Response) => {
  try {
    const { text, voice } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for TTS." });
    }

    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: text.slice(0, 300),
              speechMetadata: {
                style: "Friendly, encouraging teacher reading clearly to a student",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio, mimeType: "audio/wav" });
    } else {
      return res.status(500).json({ error: "Audio data unavailable." });
    }
  } catch (err: any) {
    console.error("TTS Server Error:", err);
    return res.status(500).json({ error: "TTS generation failed.", details: err?.message });
  }
});

// Vite middleware setup for Development & Production serving
const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LearnSelf AI - Interactive Study Assistant (Class 6–10)</title>
    <meta name="description" content="AI-powered study assistant for Class 6–10 students." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`LearnSelf AI Study Assistant server running on port ${PORT}`);
  });
}

startServer();
