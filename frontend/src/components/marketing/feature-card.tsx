import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-base font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}
