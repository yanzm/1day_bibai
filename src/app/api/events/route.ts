import { NextRequest, NextResponse } from "next/server";
import { readEvents, writeEvents } from "@/lib/spots-file";
import { Event } from "@/types/spot";

export async function GET() {
  const events = readEvents();
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events = readEvents();

    const id =
      body.id ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "") ||
      crypto.randomUUID();

    if (events.some((e) => e.id === id)) {
      return NextResponse.json(
        { error: "このIDは既に使用されています" },
        { status: 400 }
      );
    }

    const newEvent: Event = { ...body, id };
    events.push(newEvent);
    writeEvents(events);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "イベントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
