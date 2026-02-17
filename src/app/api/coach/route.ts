import { NextRequest, NextResponse } from "next/server";
import { callMiniMax, isAIEnabled } from "@/lib/minimax";
import type { MiniMaxMessage } from "@/lib/minimax";

const SYSTEM_PROMPT = `You are BuildIT, an expert AI hardware building assistant. You help users go from a rough idea to a fully working hardware product.

Your job is to:
1. ASK THE RIGHT QUESTIONS — understand what the user wants to build before recommending anything. Ask about: purpose, environment, power source, connectivity needs, budget, experience level, tools available.
2. GENERATE a Bill of Materials with specific real components, quantities, specs, and purchase search terms.
3. PROVIDE step-by-step assembly instructions with safety warnings.
4. CREATE wiring schematics with pin-to-pin connections, wire colors, and signal labels.
5. WRITE firmware code that compiles, with correct pin assignments and library usage.
6. DESIGN test procedures with expected results.
7. TROUBLESHOOT problems when the user describes issues or shows photos.

ALWAYS respond with valid JSON in this exact format:
{
  "message": "Your conversational response to the user. Use markdown for formatting. Be specific and helpful.",
  "questionsToAsk": ["question1", "question2"],
  "bom": [
    {
      "id": "p1",
      "name": "Component Name",
      "category": "microcontroller|sensor|actuator|passive|connector|power|mechanical|display|communication|other",
      "description": "What it does and why it's needed",
      "quantity": 1,
      "specs": {"key": "value"},
      "searchTerm": "search term for finding this part online",
      "estimatedPrice": "$10-15"
    }
  ],
  "assemblySteps": [
    {
      "id": "a1",
      "order": 1,
      "title": "Step title",
      "description": "Detailed instruction",
      "partsUsed": ["p1"],
      "warnings": "Safety warning if any",
      "tips": "Helpful tip"
    }
  ],
  "connections": [
    {
      "id": "w1",
      "from": {"part": "PartName", "pin": "PinName"},
      "to": {"part": "PartName", "pin": "PinName"},
      "wireColor": "red|black|blue|yellow|green|white|orange",
      "signal": "Signal description",
      "notes": "Optional notes"
    }
  ],
  "powerRails": [
    {"voltage": "5V", "source": "USB", "consumers": ["Arduino", "Servo"]}
  ],
  "designNotes": ["Note about the design"],
  "codeSnippets": [
    {
      "id": "fw1",
      "name": "Module name",
      "filename": "filename.ino",
      "language": "cpp",
      "description": "What this code does",
      "code": "// actual code here",
      "dependencies": ["Servo.h"],
      "installInstructions": "How to install libraries"
    }
  ],
  "testPlan": [
    {
      "id": "t1",
      "name": "Test name",
      "category": "power|connectivity|sensor|actuator|integration|stress",
      "steps": [
        {"id": "ts1", "instruction": "What to do", "expected": "What should happen"}
      ]
    }
  ],
  "troubleshooting": ["tip1", "tip2"],
  "warnings": ["Important safety warning"]
}

RULES:
- Only include fields that are relevant to the current conversation stage. Early on, focus on "message" and "questionsToAsk". Later, add "bom", "assemblySteps", etc.
- For BOM items, include real component names and realistic "searchTerm" values users can paste into Amazon, Adafruit, DigiKey, etc.
- For code, write COMPLETE, COMPILABLE code with all necessary includes and setup.
- For wiring, be PIN-SPECIFIC — don't say "connect to Arduino", say "connect to Arduino Uno pin D9 (PWM)".
- Always warn about safety: polarity, voltage limits, short circuits, servo stall current, etc.
- If the user is a beginner, explain WHY each step matters, not just what to do.
- Ask clarifying questions before generating a full BOM — don't assume.`;

export async function POST(req: NextRequest) {
  try {
    // Check if AI is enabled
    if (!isAIEnabled()) {
      return NextResponse.json(
        {
          aiEnabled: false,
          fallback: true,
          message:
            "AI features are not configured. Add MINIMAX_API_KEY and MINIMAX_GROUP_ID to your .env.local file. Running in basic mode with local guidance.",
          questionsToAsk: [],
          bom: [],
          assemblySteps: [],
          connections: [],
          codeSnippets: [],
          testPlan: [],
          troubleshooting: [],
          warnings: [
            "AI is disabled. Set MINIMAX_API_KEY and MINIMAX_GROUP_ID in .env.local to enable AI features.",
          ],
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const {
      messages = [],
      currentPhase = "ideation",
      projectContext = {},
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Build the conversation for MiniMax
    const contextSuffix = projectContext.description
      ? `\n\nCurrent project context:\n- Phase: ${currentPhase}\n- Description: ${projectContext.description}\n- Parts count: ${projectContext.partsCount || 0}\n- Connections count: ${projectContext.connectionsCount || 0}`
      : "";

    const miniMaxMessages: MiniMaxMessage[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT + contextSuffix,
      },
      ...messages.map(
        (m: { role: string; content: string }): MiniMaxMessage => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    ];

    const responseText = await callMiniMax(miniMaxMessages, {
      temperature: 0.7,
      maxTokens: 4096,
    });

    // Parse the JSON response
    let parsed;
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)```/) ||
        responseText.match(/```\s*([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText.trim();
      parsed = JSON.parse(jsonString);
    } catch {
      // If parsing fails, wrap the raw text as a message
      parsed = {
        message: responseText,
        questionsToAsk: [],
        bom: [],
        assemblySteps: [],
        connections: [],
        codeSnippets: [],
        testPlan: [],
        troubleshooting: [],
        warnings: [],
      };
    }

    return NextResponse.json({
      aiEnabled: true,
      ...parsed,
    });
  } catch (error) {
    console.error("Coach API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Check for specific error types
    if (message.includes("not configured")) {
      return NextResponse.json(
        {
          aiEnabled: false,
          fallback: true,
          message:
            "AI is not configured. Add your MiniMax API credentials to .env.local",
          warnings: [message],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to get AI response",
        detail: message,
      },
      { status: 500 }
    );
  }
}
