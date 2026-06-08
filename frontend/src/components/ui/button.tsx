import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-all focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        primary:   "bg-[var(--text-primary)] text-[var(--bg-base)] hover:opacity-90",
        secondary: "border border-[var(--border-mid)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]",
        ghost:     "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
        success:   "bg-[var(--green)] text-black font-semibold hover:opacity-90 shadow-[0_0_16px_var(--green-glow)]",
        danger:    "bg-[var(--red)] text-white font-semibold hover:opacity-90",
        outline:   "border border-[var(--border-mid)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
      },
      size: {
        default: "h-10 px-4",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-12 rounded-xl px-6 text-base",
        icon:    "h-9 w-9 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}