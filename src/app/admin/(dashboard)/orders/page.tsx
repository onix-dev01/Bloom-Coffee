import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatOrderTime, formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, display_id, customer_name, total, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Recent pickup orders submitted by customers."
      />

      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
          description="Customer orders will show up here after the first pickup order is submitted."
        />
      )}
    </>
  );
}
