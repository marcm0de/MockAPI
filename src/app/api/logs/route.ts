import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), ".mockapi-log.json");

export async function GET() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      const data = JSON.parse(fs.readFileSync(LOG_PATH, "utf-8"));
      return NextResponse.json(data);
    }
    return NextResponse.json([]);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(LOG_PATH)) {
      fs.unlinkSync(LOG_PATH);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
