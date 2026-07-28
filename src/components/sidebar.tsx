"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Gauge,
  Lightbulb,
  Library,
  PenLine,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", index: "01", label: "Dashboard", icon: Gauge },
  { href: "/library", index: "02", label: "Library", icon: Library },
  { href: "/compose", index: "03", label: "Compose", icon: PenLine },
  { href: "/ideas", index: "04", label: "Ideas", icon: Lightbulb },
  { href: "/calendar", index: "05", label: "Calendar", icon: CalendarDays },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <div className="sticky top-0 flex h-screen flex-col px-5 py-6">
        <Link href="/" className="block">
          <span className="font-display text-[1.75rem] font-semibold leading-none tracking-tight">
            Dispatch<span className="text-flame">.</span>
          </span>
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/50">
            Marketing command center
          </span>
        </Link>

        <nav className="mt-10 flex flex-col gap-1">
          {NAV.map(({ href, index, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    active ? "text-flame" : "text-sidebar-foreground/30 group-hover:text-flame/70"
                  )}
                >
                  {index}
                </span>
                <Icon className="size-4" />
                {label}
                {active ? <span className="ml-auto text-flame">•</span> : null}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/compose"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-flame px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flame/90"
        >
          <Plus className="size-4" />
          New draft
        </Link>

        <div className="mt-auto border-t border-sidebar-border pt-5">
          <p className="font-display text-sm italic leading-snug text-sidebar-foreground/70">
            &ldquo;Ship the story. Keep the facts.&rdquo;
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/35">
            Dispatch for GenHealth
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sidebar-border bg-sidebar text-sidebar-foreground lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Dispatch<span className="text-flame">.</span>
        </Link>
        <Link
          href="/compose"
          className="inline-flex items-center gap-1.5 rounded-lg bg-flame px-3 py-1.5 text-xs font-semibold text-white"
        >
          <Plus className="size-3.5" />
          New draft
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium",
              isActive(pathname, href)
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/60"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
