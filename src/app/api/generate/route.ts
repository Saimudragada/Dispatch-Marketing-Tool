import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { topic, channel } = await request.json();

    if (!topic || !channel) {
      return NextResponse.json({ error: "Topic and channel are required." }, { status: 400 });
    }

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
      max_tokens: 2048,
      system: brandVoice,
      messages: [
        { role: "user", content: `Topic: ${topic}\nChannel: ${channel}\n\nWrite a first draft.` },
      ],
    });

    const draftText = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ draft: draftText });
  } catch (error) {
    console.error("Generation failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error during generation.";
    return NextResponse.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}
