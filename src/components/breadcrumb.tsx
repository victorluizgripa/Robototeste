import Link from "next/link";

type BreadcrumbSegment = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  segments: BreadcrumbSegment[];
};

export function Breadcrumb({ segments }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-txt-3">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const isFirst = index === 0;

          return (
            <li key={segment.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-border-hover">
                  &gt;
                </span>
              )}
              {isFirst && <HomeIcon />}
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="hover:text-accent-600 transition-colors"
                >
                  {segment.label}
                </Link>
              ) : (
                <span className={isLast ? "text-txt-2 font-medium" : ""}>
                  {segment.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
