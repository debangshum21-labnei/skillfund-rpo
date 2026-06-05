"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function CooldownTimer({ minutes = 15 }: { minutes?: number }) {
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-white p-4 shadow-soft">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-primary">
        <Clock className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-muted">Cooldown remaining</p>
        <p className="text-2xl font-semibold text-primary">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
