const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are CodeLens, an expert code reviewer. You review a single source file
at a time and respond ONLY with a JSON object (no prose, no markdown fences) matching exactly
this schema:

{
  "summary": string,               // 1-2 sentence overview of this file's quality
  "score": number,                 // 0-100, overall quality/health score for this file
  "findings": [
    {
      "category": "bug" | "security" | "quality",
      "severity": "low" | "medium" | "high" | "critical",
      "line": number | null,       // best-effort line number, null if not applicable
      "title": string,             // short title, e.g. "Unvalidated user input"
      "description": string,       // 1-3 sentences explaining the issue and why it matters
      "suggestion": string         // concrete fix or improvement
    }
  ]
}

Only report real, specific issues you can point to in the given code. If the file looks clean,
return an empty findings array and a high score. Never invent line numbers you are not
reasonably confident about — use null instead.`;

function buildUserPrompt(filePath, content, chunkInfo) {
  const chunkNote = chunkInfo
    ? `\n\nNote: this is chunk ${chunkInfo.index + 1} of ${chunkInfo.total} of the file (large file, split by line ranges). Review only what's shown.`
    : "";
  return `File: ${filePath}${chunkNote}\n\n\`\`\`\n${content}\n\`\`\``;
}

function safeParseJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/** Sends one file (or chunk) to the Groq-hosted model and returns parsed findings. */
export async function reviewFileWithGroq(filePath, content, chunkInfo = null) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set on the server");
  }

  const body = {
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    temperature: 0.1,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(filePath, content, chunkInfo) },
    ],
  };

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Groq API ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "";
  const parsed = safeParseJson(text);

  if (!parsed || !Array.isArray(parsed.findings)) {
    return { summary: "Model response could not be parsed.", score: null, findings: [] };
  }
  return parsed;
}
