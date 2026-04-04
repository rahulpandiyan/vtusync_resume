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
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <Navbar />
        <main className="flex-1 pb-32 lg:pb-8 h-full w-full">
          <div className="max-w-[1200px] mx-auto px-0 sm:px-6 pt-0 sm:pt-12 pb-24 sm:pb-12 h-full">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
