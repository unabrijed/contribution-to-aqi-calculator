// app/api/suggest/route.ts
import { NextRequest, NextResponse } from "next/server";

export interface SuggestionPayload {
  name: string;
  category: string;
  description: string;
  tar?: string;
  nicotine?: string;
  submittedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<SuggestionPayload, "submittedAt">;

    if (!body.name?.trim() || !body.category?.trim()) {
      return NextResponse.json({ error: "name and category are required" }, { status: 400 });
    }

    const payload: SuggestionPayload = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    // ── TODO: persist to your store of choice ──────────────────────────────
    // Option A — Notion API:
    //   await notion.pages.create({ parent: { database_id: DB_ID }, properties: {...} })
    //
    // Option B — Supabase:
    //   await supabase.from("suggestions").insert(payload)
    //
    // Option C — Google Sheets via gspread / sheets API
    //
    // Option D — simple JSON file (dev only):
    //   const filePath = path.join(process.cwd(), "suggestions.jsonl");
    //   fs.appendFileSync(filePath, JSON.stringify(payload) + "\n");
    // ───────────────────────────────────────────────────────────────────────

    console.log("[suggest]", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[suggest] error", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
