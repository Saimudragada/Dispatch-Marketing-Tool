import { Channel, IdeaStatus, Status } from "@prisma/client";

export const CHANNEL_LABEL: Record<Channel, string> = {
  BLOG: "Blog",
  LINKEDIN: "LinkedIn",
  EMAIL: "Email",
};

export const CHANNELS: Channel[] = ["LINKEDIN", "EMAIL", "BLOG"];

// One dot color per channel, used everywhere a piece appears.
export const CHANNEL_DOT: Record<Channel, string> = {
  BLOG: "bg-ch-blog",
  LINKEDIN: "bg-ch-linkedin",
  EMAIL: "bg-ch-email",
};

export const CHANNEL_TEXT: Record<Channel, string> = {
  BLOG: "text-ch-blog",
  LINKEDIN: "text-ch-linkedin",
  EMAIL: "text-ch-email",
};

export const CHANNEL_CHIP: Record<Channel, string> = {
  BLOG: "bg-ch-blog/10 text-ch-blog border-ch-blog/25",
  LINKEDIN: "bg-ch-linkedin/10 text-ch-linkedin border-ch-linkedin/25",
  EMAIL: "bg-ch-email/10 text-ch-email border-ch-email/25",
};

export const STATUS_LABEL: Record<Status, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
};

export const STATUSES: Status[] = ["DRAFT", "SCHEDULED", "PUBLISHED"];

export const IDEA_STATUS_LABEL: Record<IdeaStatus, string> = {
  SPARK: "Spark",
  SHAPING: "Shaping",
  DRAFTED: "Drafted",
};

export const IDEA_STATUSES: IdeaStatus[] = ["SPARK", "SHAPING", "DRAFTED"];
