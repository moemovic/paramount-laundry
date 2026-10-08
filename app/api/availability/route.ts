import { NextResponse } from "next/server";
import { getBookedHours } from "@/lib/store";
import { parseKey } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const date = new URL(req.url).searchParams.get("date") || "";
  if (!parseKey(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  try {
    const booked = await getBookedHours(date);
    return NextResponse.json({ date, booked }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[availability]", e);
    return NextResponse.json({ date, booked: [] }, { status: 200 });
  }
}
