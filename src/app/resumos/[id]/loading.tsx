import { Skeleton } from "@/components/ui/skeleton";

export default function SummaryDetailLoading() {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-4 w-56" />

        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8 shadow-card space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-40 mt-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-6 w-52 mt-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex justify-between border-t border-border pt-4">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </main>
  );
}
