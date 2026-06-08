"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("sf-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("sf-theme", "dark");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "var(--radius-sm)",
        border: "0.5px solid var(--border-mid)",
        background: "var(--bg-elevated)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {light ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}