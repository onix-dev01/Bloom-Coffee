import { cn } from "@/lib/cn";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "error" | "info" | "success";
};

const variants = {
  error: "border-red-200 bg-red-50 text-danger",
  info: "border-brand-200 bg-brand-50 text-brand-900",
  success: "border-green-200 bg-green-50 text-success",
};

export function Alert({
  className,
  variant = "info",
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-xl border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    />
  );
}
