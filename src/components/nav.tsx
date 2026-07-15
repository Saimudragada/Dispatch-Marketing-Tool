import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold tracking-tight text-foreground">Dispatch</span>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Library
            </Link>
            <Link
              href="/calendar"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              Calendar
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/new"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            New piece
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
