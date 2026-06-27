import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning";
};

const tones = {
  default: "bg-brand-100 text-brand-800",
  success: "bg-green-100 text-success",
  warning: "bg-amber-100 text-amber-800",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
