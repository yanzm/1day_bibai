import { NextRequest, NextResponse } from "next/server";
import { readSpots, writeSpots } from "@/lib/spots-file";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const spots = readSpots();
    const index = spots.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "スポットが見つかりません" },
        { status: 404 }
      );
    }

    spots[index] = { ...body, id };
    writeSpots(spots);

    return NextResponse.json(spots[index]);
  } catch (error) {
    console.error("Error updating spot:", error);
    return NextResponse.json(
      { error: "スポットの更新に失敗しました" },
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
    const spots = readSpots();
    const index = spots.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "スポットが見つかりません" },
        { status: 404 }
      );
    }

    spots.splice(index, 1);
    writeSpots(spots);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting spot:", error);
    return NextResponse.json(
      { error: "スポットの削除に失敗しました" },
      { status: 500 }
    );
  }
}
