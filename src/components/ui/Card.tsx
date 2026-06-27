import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("card-surface p-5", className)} {...props} />;
}
