import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PlanFormData, PlanContent, THEMES, SEASONS, RoutePoint } from "@/types/plan";
import { buildPrompt } from "@/lib/prompt";

function parseAIResponse(raw: string): { plan: PlanContent; route: RoutePoint[] } {
  let plan: PlanContent = { title: "", intro: "", closing: "", notes: "" };
  let route: RoutePoint[] = [];

  const planJsonMatch = raw.match(/```plan_json\s*\n([\s\S]*?)```/);
  if (planJsonMatch) {
    try {
      plan = JSON.parse(planJsonMatch[1]);
    } catch {
      // パース失敗時はデフォルト値のまま
    }
  }

  const routeJsonMatch = raw.match(/```route_json\s*\n([\s\S]*?)```/);
  if (routeJsonMatch) {
    try {
      route = JSON.parse(routeJsonMatch[1]);
    } catch {
      // パース失敗時は空配列のまま
    }
  }

  return { plan, route };
}

async function generateWithClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY が設定されていません");
  }

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textContent = message.content.find((c) => c.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("Claude からの応答が不正です");
  }
  return textContent.text;
}

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  if (!text) {
    throw new Error("Gemini からの応答が不正です");
  }
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const data: PlanFormData = await request.json();

    if (!data.themeId || !data.seasonId) {
      return NextResponse.json(
        { error: "テーマと季節を選択してください" },
        { status: 400 }
      );
    }

    const provider = process.env.AI_PROVIDER ?? "claude";
    const prompt = buildPrompt(data.themeId, data.seasonId);

    let rawContent: string;
    if (provider === "gemini") {
      rawContent = await generateWithGemini(prompt);
    } else {
      rawContent = await generateWithClaude(prompt);
    }

    const { plan: planContent, route } = parseAIResponse(rawContent);

    const theme = THEMES.find((t) => t.id === data.themeId);
    const season = SEASONS.find((s) => s.id === data.seasonId);

    const plan = {
      id: crypto.randomUUID(),
      themeId: data.themeId,
      themeName: theme?.label ?? data.themeId,
      seasonId: data.seasonId,
      seasonName: season?.label ?? data.seasonId,
      plan: planContent,
      route,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error generating plan:", error);
    const message =
      error instanceof Error ? error.message : "プランの生成中にエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
