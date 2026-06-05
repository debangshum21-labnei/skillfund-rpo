import { AppShell } from "@/components/layout/sidebar";
import { DepositForm } from "@/components/dashboard/deposit-form";

export default function DepositPage() {
  return (
    <AppShell
      active="/deposit"
      title="Deposit"
      subtitle="Mock a real deposit and preview the equivalent simulated demo trading balance."
    >
      <DepositForm />
    </AppShell>
  );
}
