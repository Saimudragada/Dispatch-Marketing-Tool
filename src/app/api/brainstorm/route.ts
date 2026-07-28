import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { theme } = (await request.json()) as { theme?: string };

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const brandVoice = await readFile(path.join(process.cwd(), "docs", "brand-voice.md"), "utf-8");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      system: brandVoice,
      messages: [
        {
          role: "user",
          content: `Brainstorm 6 content ideas for the marketing pipeline${
            theme?.trim() ? ` around this theme: "${theme.trim()}"` : ""
          }.

Each idea must follow the tone rules and proof patterns above: stat-led or named-workflow-led, no generic marketing angles. Spread ideas across LINKEDIN, EMAIL, and BLOG channels (2 each).

Respond with ONLY a JSON array, no prose, no code fences. Each element:
{"title": "the working headline or hook", "angle": "1-2 sentences on the specific angle and what proof it leans on", "channel": "LINKEDIN" | "EMAIL" | "BLOG"}`,
        },
      ],
    });

    const raw = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end === -1) {
      throw new Error("The model did not return a parseable idea list. Try again.");
    }

    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      title?: string;
      angle?: string;
      channel?: string;
    }[];

    const ideas = parsed
      .filter((i) => i.title)
      .map((i) => ({
        title: String(i.title),
        angle: String(i.angle ?? ""),
        channel: ["LINKEDIN", "EMAIL", "BLOG"].includes(i.channel ?? "") ? i.channel : null,
      }));

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Brainstorm failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error during brainstorm.";
    return NextResponse.json({ error: `Brainstorm failed: ${message}` }, { status: 500 });
  }
}
