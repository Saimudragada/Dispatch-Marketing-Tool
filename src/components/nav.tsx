import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function Nav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground">
            Dispatch
          </span>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-secondary sm:px-3"
            >
              Library
            </Link>
            <Link
              href="/calendar"
              className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-secondary sm:px-3"
            >
              Calendar
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/new"
            className="whitespace-nowrap rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:px-3"
          >
            New piece
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary sm:px-3"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
