import { redirect } from "next/navigation";

type OrderRedirectPageProps = {
  searchParams: Promise<{ drink?: string }>;
};

export default async function OrderRedirectPage({
  searchParams,
}: OrderRedirectPageProps) {
  const params = await searchParams;
  const query = params.drink ? `?drink=${params.drink}` : "";
  redirect(`/${query}`);
}
