import { DashboardSidebar, MobileNav } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col lg:pl-64 pb-16 lg:pb-0 min-w-0">
        <Navbar />
        <main className="flex-1 w-full relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full min-h-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
