import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatOrderTime, formatPrice } from "@/lib/format";
import { SiteHeader } from "@/components/customer/SiteHeader";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/orders");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, display_id, customer_name, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page-container flex-1">
        <PageHeader
          title="Your orders"
          description="Pickup orders linked to your account."
        />

        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-brand-900">
                    Order #{order.display_id}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {order.customer_name} · {formatOrderTime(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">{formatPrice(Number(order.total))}</p>
                  <Link
                    href={`/order/confirmation?id=${order.id}`}
                    className="text-sm font-medium text-brand-700 hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders yet"
            description="Orders you place while signed in will show up here."
            action={
              <Link href="/">
                <Button>Place your first order</Button>
              </Link>
            }
          />
        )}
      </main>
    </>
  );
}
