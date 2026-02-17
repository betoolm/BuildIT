// MiniMax API client for BuildIT

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || "";
const MINIMAX_GROUP_ID = process.env.MINIMAX_GROUP_ID || "";
const MINIMAX_API_URL =
  process.env.MINIMAX_API_URL ||
  "https://api.minimax.chat/v1/text/chatcompletion_v2";

export function isAIEnabled(): boolean {
  return MINIMAX_API_KEY.length > 0 && MINIMAX_GROUP_ID.length > 0;
}

export interface MiniMaxMessage {
  role: "system" | "user" | "assistant";
  content: string | MiniMaxContentPart[];
}

export interface MiniMaxContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface MiniMaxResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
  base_resp?: {
    status_code?: number;
    status_msg?: string;
  };
}

export async function callMiniMax(
  messages: MiniMaxMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (!isAIEnabled()) {
    throw new Error("MINIMAX_API_KEY or MINIMAX_GROUP_ID not configured");
  }

  const url = `${MINIMAX_API_URL}?GroupId=${MINIMAX_GROUP_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MiniMax API error (${response.status}): ${text}`);
  }

  const data: MiniMaxResponse = await response.json();

  if (data.base_resp?.status_code && data.base_resp.status_code !== 0) {
    throw new Error(
      `MiniMax API error: ${data.base_resp.status_msg || "Unknown error"}`
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("MiniMax returned empty response");
  }

  return content;
}

export async function callMiniMaxVision(
  messages: MiniMaxMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  if (!isAIEnabled()) {
    throw new Error("MINIMAX_API_KEY or MINIMAX_GROUP_ID not configured");
  }

  const url = `${MINIMAX_API_URL}?GroupId=${MINIMAX_GROUP_ID}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({
      model: "MiniMax-Text-01",
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`MiniMax Vision API error (${response.status}): ${text}`);
  }

  const data: MiniMaxResponse = await response.json();

  if (data.base_resp?.status_code && data.base_resp.status_code !== 0) {
    throw new Error(
      `MiniMax Vision error: ${data.base_resp.status_msg || "Unknown error"}`
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("MiniMax Vision returned empty response");
  }

  return content;
}
