import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarCollapseProvider } from "@/components/dashboard/sidebar-collapse";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/utils/supabase/server";
import { checkSubscriptionPlan } from "@/utils/actions/stripe/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let isPro = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    const sub = await checkSubscriptionPlan().catch(() => null);
    isPro = sub?.hasProAccess || false;
  } catch {
    // Page handlers handle redirects if user is not authenticated
  }

  if (!user) {
    // Public shell (e.g. Free Resume Scanner) — no dashboard chrome, no account details.
    return (
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 antialiased text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 flex flex-col">
        <header className="sticky top-0 z-30 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6">
          <div className="flex h-full items-center justify-between gap-4 max-w-7xl mx-auto">
            <Logo asLink href="/" />
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-sm active:scale-95">
                  Sign in / Try Pro
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full min-h-full">
            {children}
          </div>
        </main>
        <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Terms</Link>
              <Link href="/how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">How it works</Link>
            </div>
            <p>Resume Scanner is free and anonymous — no account, no data stored.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <SidebarCollapseProvider>
      <DashboardShell user={user} isPro={isPro}>{children}</DashboardShell>
    </SidebarCollapseProvider>
  );
}