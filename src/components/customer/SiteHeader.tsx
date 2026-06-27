import Link from "next/link";
import { getSessionProfile } from "@/lib/supabase/server";
import { SiteHeaderActions } from "@/components/customer/SiteHeaderActions";

export async function SiteHeader() {
  const profile = await getSessionProfile();

  return (
    <header className="border-b bg-surface/80 backdrop-blur">
      <div className="page-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
            <svg viewBox="0 0 64 64" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M16 24c0-6.627 5.373-12 12-12h8c6.627 0 12 5.373 12 12v2H16v-2zm-2 6h32v4c0 8.837-7.163 16-16 16S16 42.837 16 34v-4zm8 20h16v4H22v-4z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-brand-900">Bloom Coffee</p>
            <p className="text-xs text-muted">Order for pickup</p>
          </div>
        </Link>
        <SiteHeaderActions
          isAdmin={profile?.role === "admin"}
          isLoggedIn={Boolean(profile)}
        />
      </div>
    </header>
  );
}
