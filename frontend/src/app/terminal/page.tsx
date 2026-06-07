import { AppShell } from "@/components/layout/sidebar";
import { TerminalView } from "@/components/trading/terminal-view";

export default function TerminalPage() {
  return (
    <AppShell
      active="/terminal"
      title="Trading terminal"
      subtitle="Simulated execution surface for session progress, PnL, positions, and trade history."
    >
      <TerminalView />
    </AppShell>
  );
}