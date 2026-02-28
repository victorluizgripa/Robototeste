import { Skeleton } from "@/components/ui/skeleton";

export default function SummariesLoading() {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-4 w-40" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-4 w-28" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="mt-3 space-y-2 flex-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
              </div>
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
