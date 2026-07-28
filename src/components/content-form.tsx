import { ContentPiece } from "@prisma/client";
import { CHANNEL_LABEL, CHANNELS, STATUSES, STATUS_LABEL } from "@/lib/labels";

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

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
          className={inputClass}
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
            defaultValue={defaultValues?.channel ?? "LINKEDIN"}
            className={inputClass}
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
            className={inputClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
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
            className={inputClass}
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
          rows={14}
          defaultValue={defaultValues?.body}
          className={`${inputClass} leading-relaxed`}
        />
      </div>

      <div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/85"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
