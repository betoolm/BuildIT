import { NextRequest, NextResponse } from "next/server";
import { callMiniMaxVision, isAIEnabled } from "@/lib/minimax";
import type { MiniMaxMessage } from "@/lib/minimax";

const VISION_SYSTEM_PROMPT = `You are BuildIT's vision system. The user has taken a photo of their hardware project for you to analyze.

Your job is to:
1. Identify any visible components (Arduino, ESP32, sensors, servos, wires, breadboard, etc.)
2. Check wiring against the expected connections provided
3. Spot potential issues: loose wires, wrong pins, missing connections, polarity errors, short circuit risks
4. Provide a verification checklist

IMPORTANT: You are analyzing a SINGLE PHOTO. Be honest about what you can and cannot determine from the image. Use phrases like "it appears that..." or "I can see what looks like..." — never make absolute claims about connections you can't clearly see.

Respond with valid JSON:
{
  "summary": "Brief overall assessment of what you see",
  "identifiedParts": [
    {"name": "Part name", "confidence": "high|medium|low", "notes": "What you observe"}
  ],
  "wiringCheck": [
    {
      "connection": "Description of the connection",
      "status": "ok|warning|error|unclear",
      "detail": "What you see and any concern"
    }
  ],
  "issues": [
    {"severity": "critical|warning|info", "description": "What's wrong and how to fix it"}
  ],
  "checklist": [
    {"item": "Thing to verify", "status": "pass|fail|check", "note": "Detail"}
  ],
  "suggestions": ["Suggestion for improvement"]
}`;

export async function POST(req: NextRequest) {
  try {
    if (!isAIEnabled()) {
      return NextResponse.json(
        {
          aiEnabled: false,
          summary:
            "AI vision is not configured. Add MINIMAX_API_KEY and MINIMAX_GROUP_ID to .env.local to enable wiring photo analysis.",
          identifiedParts: [],
          wiringCheck: [],
          issues: [],
          checklist: [],
          suggestions: [
            "Configure MiniMax API credentials to enable AI-powered wiring verification.",
          ],
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { image, projectContext = {} } = body;

    if (!image) {
      return NextResponse.json(
        { error: "image (base64) is required" },
        { status: 400 }
      );
    }

    // Validate base64 image
    if (
      !image.startsWith("data:image/") &&
      !/^[A-Za-z0-9+/=]+$/.test(image.substring(0, 100))
    ) {
      return NextResponse.json(
        { error: "Invalid image format. Expected base64-encoded image." },
        { status: 400 }
      );
    }

    // Build context about expected wiring
    let contextInfo = "";
    if (projectContext.connections?.length) {
      contextInfo += "\n\nExpected wiring connections:\n";
      for (const conn of projectContext.connections) {
        contextInfo += `- ${conn.from?.part} ${conn.from?.pin} → ${conn.to?.part} ${conn.to?.pin} (${conn.signal}, ${conn.wireColor} wire)\n`;
      }
    }
    if (projectContext.parts?.length) {
      contextInfo += "\nExpected components:\n";
      for (const part of projectContext.parts) {
        contextInfo += `- ${part.name} (${part.category})\n`;
      }
    }
    if (projectContext.currentStep) {
      contextInfo += `\nUser is currently on step: ${projectContext.currentStep}\n`;
    }

    // Ensure image has data URI prefix for the API
    const imageUrl = image.startsWith("data:image/")
      ? image
      : `data:image/jpeg;base64,${image}`;

    const messages: MiniMaxMessage[] = [
      {
        role: "system",
        content: VISION_SYSTEM_PROMPT + contextInfo,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please analyze this photo of my hardware project. Check the wiring, identify parts, and let me know if anything looks wrong.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ];

    const responseText = await callMiniMaxVision(messages, {
      temperature: 0.3,
      maxTokens: 3000,
    });

    // Parse JSON response
    let parsed;
    try {
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)```/) ||
        responseText.match(/```\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      parsed = JSON.parse(jsonString);
    } catch {
      parsed = {
        summary: responseText,
        identifiedParts: [],
        wiringCheck: [],
        issues: [],
        checklist: [],
        suggestions: [],
      };
    }

    return NextResponse.json({
      aiEnabled: true,
      ...parsed,
    });
  } catch (error) {
    console.error("Vision check API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (message.includes("not configured")) {
      return NextResponse.json(
        {
          aiEnabled: false,
          summary: "AI vision is not configured.",
          identifiedParts: [],
          wiringCheck: [],
          issues: [],
          checklist: [],
          suggestions: ["Configure MiniMax API credentials in .env.local"],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze image", detail: message },
      { status: 500 }
    );
  }
}
