import { AppShell } from "@/components/layout/sidebar";
import { TerminalView } from "@/components/trading/terminal-view";

export default function TerminalPage() {
  return (
    <AppShell active="/terminal" title="Trading terminal" subtitle="">
      <TerminalView />
    </AppShell>
  );
}