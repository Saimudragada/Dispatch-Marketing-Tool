"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Channel, IdeaStatus } from "@prisma/client";

export async function createIdea(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  if (!title) return;

  const channelRaw = formData.get("channel") as string;

  await prisma.idea.create({
    data: {
      title,
      notes: ((formData.get("notes") as string) ?? "").trim(),
      channel: channelRaw ? (channelRaw as Channel) : null,
      source: (formData.get("source") as string) === "AI" ? "AI" : "MANUAL",
    },
  });

  revalidatePath("/ideas");
  revalidatePath("/");
}

export async function updateIdeaStatus(id: string, status: IdeaStatus) {
  await prisma.idea.update({ where: { id }, data: { status } });

  revalidatePath("/ideas");
  revalidatePath("/");
}

export async function deleteIdea(id: string) {
  await prisma.idea.delete({ where: { id } });

  revalidatePath("/ideas");
  revalidatePath("/");
}
