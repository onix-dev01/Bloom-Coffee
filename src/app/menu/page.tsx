import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { DrinkCard } from "@/components/customer/DrinkCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: drinks } = await supabase
    .from("drinks")
    .select("*")
    .order("name", { ascending: true });

  return (
    <>
      <SiteHeader />
      <main className="page-container flex-1">
        <PageHeader
          title="Today's menu"
          description="Browse drinks, then head to Order to customize and checkout."
        />

        {drinks && drinks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No drinks yet"
            description="The menu will appear here once an admin adds drinks."
          />
        )}
      </main>
    </>
  );
}
