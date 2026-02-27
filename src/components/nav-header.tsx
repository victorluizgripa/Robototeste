"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RobotoLogo } from "@/components/roboto-logo";

const HIDDEN_PREFIXES = ["/login", "/auth"];

type UserInfo = {
  avatarUrl: string | null;
  initial: string;
};

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const meta = user.user_metadata ?? {};
        const name = meta.full_name || user.email?.split("@")[0] || "U";
        // Google OAuth usa "picture"; outros providers podem usar "avatar_url"
        const avatarUrl =
          (typeof meta.picture === "string" && meta.picture) ||
          (typeof meta.avatar_url === "string" && meta.avatar_url) ||
          null;
        setUserInfo({
          avatarUrl,
          initial: name.charAt(0).toUpperCase(),
        });
      }
    }

    if (!HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
      void loadUser();
    }
  }, [supabase, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    // Atrasa para não capturar o próprio clique que abriu o menu
    const t = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }

  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/">
          <RobotoLogo size={32} showText className="cursor-pointer" />
        </Link>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-txt-3">
            v{version}
          </span>

          <div className="relative z-50" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((o) => !o);
              }}
              className="flex shrink-0 cursor-pointer rounded-full ring-2 ring-border transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-500"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="Abrir menu da conta"
            >
              {userInfo ? (
                userInfo.avatarUrl ? (
                  <Image
                    src={userInfo.avatarUrl}
                    alt="Avatar"
                    width={32}
                    height={32}
                    referrerPolicy="no-referrer"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-sm font-semibold text-accent-700">
                    {userInfo.initial}
                  </div>
                )
              ) : (
                <div className="h-8 w-8 animate-pulse rounded-full bg-surface-2" />
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-xl border border-border bg-surface py-1 shadow-card"
                aria-label="Menu da conta"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-2.5 text-left text-sm text-txt-2 hover:bg-surface-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Meu perfil
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-2.5 text-left text-sm text-txt-2 hover:bg-surface-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Configurações
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  role="menuitem"
                  className="w-full px-4 py-2.5 text-left text-sm text-txt-2 hover:bg-surface-2 hover:text-txt"
                  onClick={() => void handleLogout()}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
