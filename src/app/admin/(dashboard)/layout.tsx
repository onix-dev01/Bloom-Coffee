import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <div className="page-container flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm text-muted hover:text-brand-800">
              ← Back to shop
            </Link>
            <p className="mt-1 text-lg font-semibold text-brand-900">Bloom Coffee Admin</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AdminNav />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="page-container">{children}</main>
    </div>
  );
}
