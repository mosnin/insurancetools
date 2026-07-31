import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "blue" | "green";
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight",
        {
          "bg-slate-100 text-slate-600": variant === "default",
          "bg-blue-50 text-blue-700": variant === "blue",
          "bg-green-50 text-green-700": variant === "green",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
