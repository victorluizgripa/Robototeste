import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionDetailLoading() {
  return (
    <main className="min-h-screen bg-bg px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-4 w-64" />

        <div className="rounded-2xl border border-border bg-surface shadow-card p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-5 w-36 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <Skeleton className="h-3 w-24" />

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
