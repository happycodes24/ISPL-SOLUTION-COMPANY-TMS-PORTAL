import * as Icons from "lucide-react";

interface Props {
  icon?: string;
  title: string;
  message: string;
  note?: string;
}

export default function EmptyState({ icon = "Inbox", title, message, note }: Props) {
  const Icon = (Icons as Record<string, any>)[icon] ?? Icons.Inbox;
  return (
    <div className="glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center">
      <div className="mb-4 rounded-2xl bg-iav-grad-soft p-4">
        <Icon className="h-7 w-7 text-iav-red" />
      </div>
      <h3 className="font-display text-lg font-600 text-[var(--text)]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[var(--text-muted)]">{message}</p>
      {note && <p className="mt-3 rounded-full bg-iav-grad-soft px-3 py-1 text-xs font-600 text-iav-red">{note}</p>}
    </div>
  );
}
