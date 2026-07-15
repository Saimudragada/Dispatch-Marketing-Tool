import { ContentPiece } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { CHANNEL_LABEL, CHANNELS } from "@/lib/labels";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function ContentForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Pick<ContentPiece, "title" | "channel" | "status" | "scheduledDate" | "body">;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={defaultValues?.title}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="channel" className="text-sm font-medium text-foreground">
            Channel
          </label>
          <select
            id="channel"
            name="channel"
            defaultValue={defaultValues?.channel ?? "BLOG"}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {CHANNEL_LABEL[channel]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "DRAFT"}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="scheduledDate" className="text-sm font-medium text-foreground">
            Scheduled date
          </label>
          <input
            id="scheduledDate"
            name="scheduledDate"
            type="date"
            required
            defaultValue={
              defaultValues ? toDateInputValue(defaultValues.scheduledDate) : toDateInputValue(new Date())
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium text-foreground">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={12}
          defaultValue={defaultValues?.body}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
