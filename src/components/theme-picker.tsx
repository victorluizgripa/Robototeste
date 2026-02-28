"use client";

import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";

type Subject = { id: string; name: string };
type Theme = { id: string; name: string; subject_id: string };

type ThemePickerProps = {
  subjects: Subject[];
  themes: Theme[];
  value: string;
  onChange: (themeId: string) => void;
  disabled?: boolean;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 text-txt-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-accent-600"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ThemePicker({
  subjects,
  themes,
  value,
  onChange,
  disabled = false,
}: ThemePickerProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const themesBySubject = useMemo(() => {
    const map = new Map<string, Theme[]>();
    for (const theme of themes) {
      const list = map.get(theme.subject_id) ?? [];
      list.push(theme);
      map.set(theme.subject_id, list);
    }
    return map;
  }, [themes]);

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return { subjects, themesBySubject };

    const matchingSubjects: Subject[] = [];
    const filteredMap = new Map<string, Theme[]>();

    for (const subject of subjects) {
      const subjectMatch = normalize(subject.name).includes(q);
      const subjectThemes = themesBySubject.get(subject.id) ?? [];
      const matchedThemes = subjectMatch
        ? subjectThemes
        : subjectThemes.filter((t) => normalize(t.name).includes(q));

      if (matchedThemes.length > 0) {
        matchingSubjects.push(subject);
        filteredMap.set(subject.id, matchedThemes);
      }
    }

    return { subjects: matchingSubjects, themesBySubject: filteredMap };
  }, [subjects, themesBySubject, search]);

  const isSearching = search.trim().length > 0;

  const toggleSubject = useCallback((subjectId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  }, []);

  const isExpanded = (subjectId: string) =>
    isSearching || expanded.has(subjectId);

  return (
    <div className={`min-w-0 w-full ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <Input
        icon={<SearchIcon />}
        placeholder="Buscar tema ou matéria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      <div className="max-h-72 overflow-x-hidden overflow-y-auto rounded-xl border border-border">
        {filtered.subjects.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-txt-3">
            Nenhum tema encontrado.
          </p>
        ) : (
          <ul role="listbox" aria-label="Temas">
            {filtered.subjects.map((subject) => {
              const subjectThemes =
                filtered.themesBySubject.get(subject.id) ?? [];
              const open = isExpanded(subject.id);

              return (
                <li key={subject.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className="flex w-full min-w-0 items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-2"
                    aria-expanded={open}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <ChevronIcon expanded={open} />
                      <span className="truncate text-sm font-semibold text-txt" title={subject.name}>
                        {subject.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-txt-3">
                      {subjectThemes.length}{" "}
                      {subjectThemes.length === 1 ? "tema" : "temas"}
                    </span>
                  </button>

                  {open && (
                    <ul className="min-w-0 overflow-hidden pb-1">
                      {subjectThemes.map((theme) => {
                        const selected = value === theme.id;
                        return (
                          <li key={theme.id} className="min-w-0">
                            <button
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => onChange(theme.id)}
                              className={`flex w-full min-w-0 items-center justify-between gap-2 px-4 py-2.5 pl-10 text-left text-sm transition-colors ${
                                selected
                                  ? "bg-accent-50 text-accent-700 font-medium"
                                  : "text-txt-2 hover:bg-surface-2"
                              }`}
                            >
                              <span className="min-w-0 flex-1 truncate" title={theme.name}>
                                {theme.name}
                              </span>
                              {selected && <span className="shrink-0"><CheckIcon /></span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
