import { NextRequest, NextResponse } from "next/server";
import { readEvents, writeEvents } from "@/lib/spots-file";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const events = readEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "イベントが見つかりません" },
        { status: 404 }
      );
    }

    events[index] = { ...body, id };
    writeEvents(events);

    return NextResponse.json(events[index]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "イベントの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = readEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "イベントが見つかりません" },
        { status: 404 }
      );
    }

    events.splice(index, 1);
    writeEvents(events);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "イベントの削除に失敗しました" },
      { status: 500 }
    );
  }
}
