import { Channel } from "@prisma/client";
import { PageHeader } from "@/components/page-header";
import { ComposeWorkbench } from "@/components/compose-workbench";
import { CHANNELS } from "@/lib/labels";

export default async function ComposePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; channel?: string; date?: string }>;
}) {
  const { topic, channel, date } = await searchParams;
  const initialChannel = CHANNELS.includes(channel as Channel)
    ? (channel as Channel)
    : "LINKEDIN";
  const initialDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker="AI studio"
        title="The drafting"
        titleAccent="studio"
        description="Give it a topic and a channel — get a first draft in the house voice, grounded in the brand-voice reference, never generic. Then make it yours."
      />
      <ComposeWorkbench
        initialTopic={topic ?? ""}
        initialChannel={initialChannel}
        initialDate={initialDate}
      />
    </div>
  );
}
