import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { OrderBuilder } from "@/components/customer/OrderBuilder";
import { PageHeader } from "@/components/ui/PageHeader";

type HomePageProps = {
  searchParams: Promise<{ drink?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: drinks }, { data: addOns }] = await Promise.all([
    supabase.from("drinks").select("*").order("name", { ascending: true }),
    supabase.from("add_ons").select("*").order("name", { ascending: true }),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="page-container flex-1">
        <PageHeader
          title="Build your order"
          description="Add drinks, pick add-ons, and watch your total update."
        />
        <Suspense fallback={<p className="text-sm text-muted">Loading order...</p>}>
          <OrderBuilder
            drinks={drinks ?? []}
            addOns={addOns ?? []}
            initialDrinkId={params.drink}
          />
        </Suspense>
      </main>
    </>
  );
}
