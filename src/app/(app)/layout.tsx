import { Sidebar, MobileNav } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background lg:flex-row">
      <Sidebar />
      <MobileNav />
      <main className="min-w-0 flex-1 bg-dotgrid">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
