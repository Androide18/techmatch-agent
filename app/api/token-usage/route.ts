import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [result] = await sql`
      SELECT input_tokens, output_tokens, reasoning_tokens, total_tokens, source, created_at
      FROM token_usage
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (!result) {
      return NextResponse.json({ error: "No token usage found" }, { status: 404 });
    }

    // Return in camelCase
    return NextResponse.json({
      tokenUsage: {
        inputTokens: result.input_tokens,
        outputTokens: result.output_tokens,
        reasoningTokens: result.reasoning_tokens,
        totalTokens: result.total_tokens,
        source: result.source,
        createdAt: result.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching token usage:", error);
    return NextResponse.json({ error: "Error fetching token usage" }, { status: 500 });
  }
}
