import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--bg-base)]">
      <div className="app-container flex flex-col gap-4 py-8 text-sm text-[var(--text-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-primary">SkillFund</p>
          <p>Frontend MVP. Trading and payments are simulated.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
          <Link href="/deposit" className="hover:text-primary">
            Deposit
          </Link>
          <Link href="/terminal" className="hover:text-primary">
            Terminal
          </Link>
        </div>
      </div>
    </footer>
  );
}
