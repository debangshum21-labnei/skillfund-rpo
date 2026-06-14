"use client";

import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/store/session-store";

function relativeTime(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ActivityFeed() {
  const activities = useSessionStore((s) => s.sessionActivities);

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No activity yet</p>
      ) : (
        activities.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-primary">{item.title}</p>
              <Badge tone={item.tone}>{relativeTime(item.createdAt)}</Badge>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
