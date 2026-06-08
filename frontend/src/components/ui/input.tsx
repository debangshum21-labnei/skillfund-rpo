"use client";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function Input({ className, style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("w-full text-sm transition-all placeholder:opacity-40", className)}
      style={{
        height: 40, padding: "0 12px",
        borderRadius: "var(--radius-sm)",
        border: "0.5px solid var(--border-mid)",
        background: "var(--bg-elevated)",
        color: "var(--text-primary)",
        outline: "none",
        fontFamily: "var(--font-sans)",
        ...style,
      }}
      {...props}
    />
  );
}

export function PasswordInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <Input
        {...props}
        type={show ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", padding: 2, display: "flex",
        }}
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

export function Label({ className, style, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-xs font-medium", className)}
      style={{ color: "var(--text-secondary)", ...style }}
      {...props}
    />
  );
}