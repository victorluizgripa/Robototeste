"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type QuestionFiltersProps = {
  subjects: Subject[];
  bancas: string[];
  themes: Theme[];
  currentSearch?: string;
  currentBanca?: string;
  currentSubject?: string;
  currentTheme?: string;
};

export function QuestionFilters({
  subjects,
  bancas,
  themes,
  currentSearch,
  currentBanca,
  currentSubject,
  currentTheme,
}: QuestionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(currentSearch ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ search: value || undefined });
    }, 400);
  };

  const filteredThemes = useMemo(() => {
    if (!currentSubject) return themes;
    return themes.filter((t) => t.subject_id === currentSubject);
  }, [themes, currentSubject]);

  const hasFilters =
    currentBanca || currentSubject || currentTheme || currentSearch;

  return (
    <div className="space-y-3">
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar por palavra-chave..."
        icon={<SearchIcon />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-txt-3 flex items-center gap-1.5">
          <FilterIcon />
          Filtros:
        </span>

        <Select
          value={currentBanca ?? ""}
          onChange={(e) => pushParams({ banca: e.target.value || undefined })}
          placeholder="Todas as Bancas"
          options={bancas.map((b) => ({ value: b, label: b }))}
        />

        <Select
          value={currentSubject ?? ""}
          onChange={(e) =>
            pushParams({
              subject: e.target.value || undefined,
              theme: undefined,
            })
          }
          placeholder="Todas as Matérias"
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        />

        <Select
          value={currentTheme ?? ""}
          onChange={(e) => pushParams({ theme: e.target.value || undefined })}
          placeholder="Todos os Temas"
          options={filteredThemes.map((t) => ({
            value: t.id,
            label: t.name,
          }))}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              pushParams({
                search: undefined,
                banca: undefined,
                subject: undefined,
                theme: undefined,
              });
            }}
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-accent-600 hover:bg-accent-50 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
