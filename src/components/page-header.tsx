export function PageHeader({
  kicker,
  title,
  titleAccent,
  description,
  children,
}: {
  kicker: string;
  title: string;
  titleAccent?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="kicker">✦ {kicker}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-[2.75rem] sm:leading-[1.05]">
          {title}
          {titleAccent ? (
            <>
              {" "}
              <em className="text-flame">{titleAccent}</em>
            </>
          ) : null}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}
