import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFile } from "fs/promises";
import path from "path";
import { Channel } from "@prisma/client";
import { CHANNELS, CHANNEL_LABEL } from "@/lib/labels";

export async function POST(request: Request) {
  try {
    const { title, sourceChannel, sourceBody } = (await request.json()) as {
      title?: string;
      sourceChannel?: Channel;
      sourceBody?: string;
    };

    if (!title || !sourceChannel || !sourceBody) {
      return NextResponse.json(
        { error: "title, sourceChannel, and sourceBody are required." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const brandVoice = await readFile(path.join(process.cwd(), "docs", "brand-voice.md"), "utf-8");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const targetChannels = CHANNELS.filter((c) => c !== sourceChannel);

    const results = await Promise.all(
      targetChannels.map(async (targetChannel) => {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-5",
          max_tokens: 2048,
          system: brandVoice,
          messages: [
            {
              role: "user",
              content: `Source piece (channel: ${CHANNEL_LABEL[sourceChannel]}, title: "${title}"):\n\n${sourceBody}\n\nRepurpose this piece for ${CHANNEL_LABEL[targetChannel]}. Preserve every specific number, name, and claim from the source exactly — never invent, round, or drift any stat, name, or quote. Only change structure, length, and framing to match the ${CHANNEL_LABEL[targetChannel]} format.`,
            },
          ],
        });

        const draftText = response.content
          .filter((block) => block.type === "text")
          .map((block) => block.text)
          .join("\n");

        return { channel: targetChannel, body: draftText };
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Repurposing failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error during repurposing.";
    return NextResponse.json({ error: `Repurposing failed: ${message}` }, { status: 500 });
  }
}
