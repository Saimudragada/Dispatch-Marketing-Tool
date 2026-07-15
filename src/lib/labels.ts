import { Channel } from "@prisma/client";

export const CHANNEL_LABEL: Record<Channel, string> = {
  BLOG: "Blog",
  LINKEDIN: "LinkedIn",
  EMAIL: "Email",
};

export const CHANNELS: Channel[] = ["BLOG", "LINKEDIN", "EMAIL"];
