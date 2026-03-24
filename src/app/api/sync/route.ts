import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), ".mockapi-data.json");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_PATH, JSON.stringify(body, null, 2));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (fs.existsSync(DATA_PATH)) {
      const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
      return NextResponse.json(data);
    }
    return NextResponse.json({ endpoints: [], corsConfig: null });
  } catch {
    return NextResponse.json({ endpoints: [], corsConfig: null });
  }
}
