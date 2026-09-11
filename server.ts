import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in your Settings/Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are Clear Clause AI, an AI assistant designed to help users understand legal language in simple and accessible terms.
Your primary purpose is explanation and education. You do NOT present yourself as a lawyer or provide definitive legal advice.

Core Capabilities:
1. Explain complicated legal clauses in simple, plain English without unnecessary jargon.
2. Answer questions about a specific clause provided by the user.
3. Identify potentially risky or important wording, obligations, restrictions, hidden fees, penalties, deadlines, and termination conditions.
4. Explain legal terminology in straightforward terms.
5. Summarize long legal clauses and agreements concisely.
6. Compare two clauses when provided by highlighting differences in user rights, liability, and obligations.
7. Answer follow-up questions while maintaining conversation context.
8. Clearly state when professional legal advice may be necessary.

Guidelines & Tone:
- Professional, minimal, trustworthy, objective, and easy to understand.
- Concise by default. Provide deeper details, clause comparisons, or alternative wording when requested.
- If the user asks about a specific clause or term but has not provided it and there is no active document context, politely ask them to paste or specify the clause.
- When identifying risk, always use the standardized risk tiers:
  🟢 Low Risk - Standard, balanced commercial terms.
  🟡 Medium Risk - Clauses requiring careful attention (e.g., auto-renewals, unilateral policy changes, mandatory arbitration, data sharing).
  🔴 High Risk - Unfavorable or aggressive clauses (e.g., broad liability disclaimers, class action bans, forfeitures, perpetual content licensing).
- Do NOT automatically claim that something is illegal, unenforceable, or legally invalid.
  Use phrasing such as:
  "This clause may be worth reviewing because..."
  "You may want to consult qualified legal counsel regarding..."
  rather than "This clause is illegal."
- Formatting: Use structured markdown with clean section headers (###), bold key terms, and bulleted or numbered lists for high legibility. Highlight warnings prominently.
- Always include a brief reminder when relevant: "Clear Clause AI is an educational analysis tool and does not constitute formal legal advice."`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

interface ChatHistoryItem {
  role: "user" | "model";
  content: string;
}

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      contextDocument,
      activeClause,
    }: {
      message: string;
      history?: ChatHistoryItem[];
      contextDocument?: {
        companyName?: string;
        documentTitle?: string;
        summarySnippet?: string;
      };
      activeClause?: {
        title?: string;
        snippet?: string;
        explanation?: string;
        riskLevel?: string;
      };
    } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A message string is required." });
    }

    const ai = getGenAI();

    // Build context preamble if user is currently viewing a document or clause
    let contextHeader = "";
    if (activeClause && (activeClause.title || activeClause.snippet)) {
      contextHeader += `\n[Active Clause Context in Clear Clause Workspace: Title: "${activeClause.title || "Selected Clause"}", Risk: ${activeClause.riskLevel || "Unknown"}, Snippet: "${activeClause.snippet || activeClause.explanation || ""}"]\n`;
    } else if (contextDocument && contextDocument.companyName) {
      contextHeader += `\n[Active Document Context in Clear Clause Workspace: Company: "${contextDocument.companyName}", Title: "${contextDocument.documentTitle || "Terms & Conditions"}", Summary: "${contextDocument.summarySnippet || ""}"]\n`;
    }

    // Format previous history for Gemini
    // Gemini 3.8 flash contents array format: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

    // Filter valid history turns
    if (Array.isArray(history)) {
      for (const turn of history.slice(-12)) {
        if (turn && turn.content && (turn.role === "user" || turn.role === "model")) {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.content }],
          });
        }
      }
    }

    // Append the current turn with any active document/clause context
    const currentMessageText = contextHeader
      ? `${contextHeader}\nUser Question: ${message.trim()}`
      : message.trim();

    contents.push({
      role: "user",
      parts: [{ text: currentMessageText }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const replyText = response.text || "I was unable to generate an explanation for that clause. Please try again or rephrase.";

    return res.json({
      reply: replyText,
    });
  } catch (err: any) {
    console.error("Gemini Chat API Error:", err);
    const errorMessage = err?.message || "Failed to process chat request.";
    const isApiKeyMissing = errorMessage.includes("GEMINI_API_KEY");

    return res.status(500).json({
      error: isApiKeyMissing
        ? "Gemini API key is not configured. Please ensure your GEMINI_API_KEY is added in Settings > Secrets."
        : `Clear Clause AI encountered an error: ${errorMessage}`,
    });
  }
});

// Community AI Answer endpoint
app.post("/api/community/ai-answer", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title && !content) {
      return res.status(400).json({ error: "Title or content is required." });
    }

    const ai = getGenAI();
    const prompt = `You are Clear Clause AI providing an objective, educational explanation for a question posted in the Clear Clause legal community forum.

Community Category: ${category || "General Discussion"}
Post Title: ${title || ""}
Post Content:
${content || ""}

Provide a clear, simple, plain-English educational breakdown:
1. Explain what this concept or clause means in real life.
2. Highlight standard commercial practice or common consumer caveats to watch out for.
3. Keep it professional, structured, and easy to read (use 2-3 concise paragraphs or bullet points).

Remember: Provide educational analysis only. Do NOT provide legal advice or declare anything unconditionally illegal. End with an objective note.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const aiExplanation = response.text || "Automatic renewal generally means that a subscription or term continues automatically after the current period unless explicitly canceled according to the stated terms.";

    return res.json({
      answer: aiExplanation,
      disclaimer: "AI-generated information is for educational purposes and should not be treated as legal advice.",
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Community AI Answer API Error:", err);
    const errorMessage = err?.message || "Failed to generate AI community answer.";
    return res.status(500).json({
      error: `Clear Clause AI explanation error: ${errorMessage}`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clear Clause server running on http://localhost:${PORT}`);
  });
}

startServer();
