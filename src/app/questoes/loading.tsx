import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionsLoading() {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-4 w-48" />

        <div className="flex flex-col items-center gap-2 py-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 md:p-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        <Skeleton className="h-4 w-44" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card"
            >
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="mt-3 space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <Skeleton className="h-4 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
