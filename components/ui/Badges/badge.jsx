// import { cn } from "../utils/cn";
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
const badgeVariants = {
  default: "bg-gray-200 text-gray-800",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  destructive: "bg-red-100 text-red-700",
};

export default function Badge({ children, variant = "success", className }) {
  return (
    <span className={cn("px-3 py-1 rounded-full text-sm font-medium", badgeVariants[variant], className)}>
      {children}
    </span>
  );
}
