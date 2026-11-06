import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Home Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 sm:w-64" />
          <Skeleton className="h-4 w-72 sm:w-96" />
        </div>
        <Skeleton className="h-9 w-44 rounded-xl" />
      </div>

      {/* Profile Overview Banner Skeleton */}
      <Card className="border-border">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-56" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-lg" />
        </CardContent>
      </Card>

      {/* 4-Card KPI Metric Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs & Resume Grid Skeleton */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <Skeleton className="h-9 w-72 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>

        <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-border">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-64" />
            </div>
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Skeleton className="w-full aspect-[8.5/11] rounded-xl" />
            <Skeleton className="w-full aspect-[8.5/11] rounded-xl" />
            <Skeleton className="w-full aspect-[8.5/11] rounded-xl" />
            <Skeleton className="w-full aspect-[8.5/11] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}