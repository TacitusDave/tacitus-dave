export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-20">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </div>
      <h1 className="mt-4 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground-muted">
        {description}
      </p>
    </div>
  );
}
