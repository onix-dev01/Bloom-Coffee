"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { CustomerNav } from "@/components/customer/CustomerNav";

type SiteHeaderActionsProps = {
  isAdmin: boolean;
  isLoggedIn: boolean;
};

export function SiteHeaderActions({ isAdmin, isLoggedIn }: SiteHeaderActionsProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <CustomerNav isLoggedIn={isLoggedIn} />
      {isAdmin ? (
        <Link href="/admin">
          <Button variant="ghost">Admin</Button>
        </Link>
      ) : null}
      {isLoggedIn ? (
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      ) : (
        <Link href="/login">
          <Button variant="ghost">Sign in</Button>
        </Link>
      )}
    </div>
  );
}
