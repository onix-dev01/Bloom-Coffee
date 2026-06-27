import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ConfirmationPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;

  if (!params.id) {
    notFound();
  }

  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!order) {
    notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  const itemRows = await Promise.all(
    (items ?? []).map(async (item) => {
      const { data: addOns } = await supabase
        .from("order_item_addons")
        .select("*")
        .eq("order_item_id", item.id);

      return { item, addOns: addOns ?? [] };
    }),
  );

  return (
    <>
      <SiteHeader />
      <main className="page-container flex-1">
        <Card className="mx-auto max-w-2xl space-y-6 text-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Order received
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-brand-900">
              Order #{order.display_id}
            </h1>
            <p className="mt-3 text-muted">
              We&apos;ll call <span className="font-medium text-brand-900">{order.customer_name}</span> when your order is ready.
            </p>
          </div>

          <div className="rounded-2xl border bg-brand-50 p-5 text-left">
            <h2 className="mb-4 font-semibold text-brand-900">Order summary</h2>
            <ul className="space-y-4">
              {itemRows.map(({ item, addOns }) => (
                <li key={item.id} className="border-b border-brand-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {item.quantity}× {item.drink_name}
                      </p>
                      {addOns.length > 0 ? (
                        <p className="mt-1 text-sm text-muted">
                          {addOns.map((addon) => addon.add_on_name).join(", ")}
                        </p>
                      ) : null}
                    </div>
                    <p className="font-medium">{formatPrice(Number(item.line_total))}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-brand-200 pt-4 font-semibold">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto">Order again</Button>
            </Link>
            <Link href="/menu">
              <Button variant="secondary" className="w-full sm:w-auto">
                View menu
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </>
  );
}
