import { NextRequest, NextResponse } from "next/server";
import { readSpots, writeSpots } from "@/lib/spots-file";
import { Spot } from "@/types/spot";

export async function GET() {
  const spots = readSpots();
  return NextResponse.json(spots);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const spots = readSpots();

    const id =
      body.id ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "") ||
      crypto.randomUUID();

    if (spots.some((s) => s.id === id)) {
      return NextResponse.json(
        { error: "このIDは既に使用されています" },
        { status: 400 }
      );
    }

    const newSpot: Spot = { ...body, id };
    spots.push(newSpot);
    writeSpots(spots);

    return NextResponse.json(newSpot, { status: 201 });
  } catch (error) {
    console.error("Error creating spot:", error);
    return NextResponse.json(
      { error: "スポットの作成に失敗しました" },
      { status: 500 }
    );
  }
}
