import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface ComicRequest {
  planTitle: string;
  planIntro: string;
  spots: string[]; // スポット名の配列
  theme: string;
  season: string;
}

async function loadCharacterImage(filename: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "characters", filename);
    const buffer = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
    return { data: buffer.toString("base64"), mimeType };
  } catch {
    return null;
  }
}

function buildComicPrompt(data: ComicRequest): string {
  const spotsText = data.spots.slice(0, 3).join("、");
  return `Generate a single vertical 4-panel comic strip (4koma manga style) image.

Characters: A cute bean goose bird mascot named "マミィーちゃん" and a funny yakitori skewer man named "やきとり男" (shown in the reference images).

Setting: They are visiting Bibai, Hokkaido, Japan. Theme: "${data.theme}", Season: "${data.season}".
Places they visit: ${spotsText}

Panel 1 (top): The two characters arrive excitedly in Bibai.
Panel 2: They enjoy visiting a spot together.
Panel 3: やきとり男 does something silly or unexpected.
Panel 4 (bottom): Funny punchline ending.

Style: Cute, colorful, kawaii manga style. Each panel has speech bubbles with short Japanese text. Panels are stacked vertically in one image with clear borders between them.`;
}

export async function POST(request: NextRequest) {
  try {
    const data: ComicRequest = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 参考画像を読み込む
    const mamyImage = await loadCharacterImage("mamy.png");
    const yakitoriImage = await loadCharacterImage("yakitori.png");

    const prompt = buildComicPrompt(data);

    // コンテンツパーツを構築（参考画像を先に、プロンプトを後に）
    const contents: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    if (mamyImage) {
      contents.push({ inlineData: { mimeType: mamyImage.mimeType, data: mamyImage.data } });
    }
    if (yakitoriImage) {
      contents.push({ inlineData: { mimeType: yakitoriImage.mimeType, data: yakitoriImage.data } });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const panels: string[] = [];
    let title = "マミーちゃんとやきおじの美唄冒険";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          const firstLine = part.text.trim().split("\n")[0];
          if (firstLine) {
            title = firstLine;
          }
        } else if (part.inlineData) {
          panels.push(
            `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          );
        }
      }
    }

    if (panels.length === 0) {
      return NextResponse.json(
        { error: "4コマ漫画の画像を生成できませんでした" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      title,
      panels,
    });
  } catch (error) {
    console.error("Error generating comic:", error);
    const message =
      error instanceof Error ? error.message : "4コマ漫画の生成中にエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
