import { createClient } from "@/lib/supabase/server";
import { DrinkManager } from "@/components/admin/DrinkManager";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function AdminDrinksPage() {
  const supabase = await createClient();
  const { data: drinks } = await supabase
    .from("drinks")
    .select("*")
    .order("name", { ascending: true });

  return (
    <>
      <PageHeader
        title="Drinks"
        description="Update names, descriptions, and base prices."
      />
      <DrinkManager drinks={drinks ?? []} />
    </>
  );
}
