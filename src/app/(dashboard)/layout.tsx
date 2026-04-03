import { DashboardSidebar, MobileNav } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <DashboardSidebar />
      <main className="flex-1 lg:pl-72 pb-24 lg:pb-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-12">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
