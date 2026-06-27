import { createClient } from "@/lib/supabase/server";
import { AddOnManager } from "@/components/admin/AddOnManager";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function AdminAddOnsPage() {
  const supabase = await createClient();
  const { data: addOns } = await supabase
    .from("add_ons")
    .select("*")
    .order("name", { ascending: true });

  return (
    <>
      <PageHeader
        title="Add-ons"
        description="Manage customization options and their prices."
      />
      <AddOnManager addOns={addOns ?? []} />
    </>
  );
}
