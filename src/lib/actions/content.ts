"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Channel, Status } from "@prisma/client";

function parseContentForm(formData: FormData) {
  return {
    title: formData.get("title") as string,
    channel: formData.get("channel") as Channel,
    status: formData.get("status") as Status,
    scheduledDate: new Date(formData.get("scheduledDate") as string),
    body: formData.get("body") as string,
  };
}

export async function createContentPiece(formData: FormData) {
  const data = parseContentForm(formData);

  await prisma.contentPiece.create({ data });

  revalidatePath("/");
  revalidatePath("/calendar");
  redirect("/");
}

export async function updateContentPiece(id: string, formData: FormData) {
  const data = parseContentForm(formData);

  await prisma.contentPiece.update({ where: { id }, data });

  revalidatePath("/");
  revalidatePath("/calendar");
  redirect("/");
}

export async function deleteContentPiece(id: string) {
  await prisma.contentPiece.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/calendar");
}

export async function updateStatus(id: string, status: Status) {
  await prisma.contentPiece.update({ where: { id }, data: { status } });

  revalidatePath("/");
  revalidatePath("/calendar");
}
