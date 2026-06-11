import { AppShell } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/layout/auth/logout-button";
import { formatINR, formatUSD, nullishToNumber } from "@/lib/balanceFormat";
import { getAuthedAccountPageData } from "@/lib/accountData";

function formatMemberSince(iso: string) {
    if (!iso) return "Unknown";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

export default async function AccountPage() {
    try {
        const data = await getAuthedAccountPageData();

        return (
            <AppShell
                active="/dashboard/account"
                title="Account"
                subtitle="Your profile and balance summary."
            >
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-3">
                                <span>Account overview</span>
                                <Badge tone="neutral">Authenticated</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted">Name</p>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600 }}>
                                    {data.name}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted">Email</p>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{data.email || "—"}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted">Member Since</p>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{formatMemberSince(data.memberSince)}</p>
                            </div>

                            <div className="pt-2">
                                <LogoutButton />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Deposit Balance (INR)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
                                    {formatINR(nullishToNumber(data.depositBalance))}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Real Balance (INR)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
                                    {formatINR(nullishToNumber(data.realBalance))}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Demo Balance (USD)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
                                    {formatUSD(nullishToNumber(data.demoBalance))}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppShell>
        );
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);

        if (message === "EMPTY") {
            return (
                <AppShell active="/dashboard/account" title="Account" subtitle="Your profile and balance summary.">
                    <Card>
                        <CardHeader>
                            <CardTitle>No account data found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted">We couldn't find your profile and account records yet.</p>
                        </CardContent>
                    </Card>
                </AppShell>
            );
        }

        return (
            <AppShell active="/dashboard/account" title="Account" subtitle="Your profile and balance summary.">
                <Card>
                    <CardHeader>
                        <CardTitle>Failed to load account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-600">{message}</p>
                    </CardContent>
                </Card>
            </AppShell>
        );
    }
}

