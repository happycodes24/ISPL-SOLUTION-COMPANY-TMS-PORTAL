interface Props {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, action }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-sm text-[var(--text-muted)]">{eyebrow}</p>}
        <h1 className="font-display text-2xl font-700 text-[var(--text)] md:text-3xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
