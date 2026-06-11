import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { nullishToNumber } from "@/lib/balanceFormat";

export type AccountPageData = {
    name: string;
    email: string;
    memberSince: string; // ISO string
    depositBalance: number;
    demoBalance: number;
    realBalance: number;
};

function formatDisplayName(args: {
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
}) {
    const displayName = (args.displayName ?? "").trim();
    if (displayName) return displayName;

    const nameFromName = (args.name ?? "").trim();
    if (nameFromName) return nameFromName;

    const first = (args.firstName ?? "").trim();
    const last = (args.lastName ?? "").trim();
    const combined = `${first} ${last}`.trim();
    return combined || "User";
}

export async function getAuthedAccountPageData(): Promise<AccountPageData> {
    const supabase = createSupabaseServerClient();

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        throw new Error(sessionError.message);
    }

    const user = sessionData.session?.user;
    if (!user) {
        throw new Error("Not authenticated");
    }

    const userId = user.id;

    const [{ data: profile, error: profileError }, { data: account, error: accountError }] = await Promise.all([
        supabase
            .from("profiles")
            .select("id, display_name, first_name, last_name, email, name, created_at")
            .eq("id", userId)
            .maybeSingle(),
        supabase
            .from("accounts")
            .select("id, user_id, profile_id, deposit_balance, demo_balance, real_balance, created_at")
            .eq("user_id", userId)
            .maybeSingle(),
    ]);

    if (profileError) throw new Error(profileError.message);
    if (accountError) throw new Error(accountError.message);

    if (!profile && !account) {
        // Let page decide empty state.
        throw new Error("EMPTY");
    }

    const depositBalance = nullishToNumber(account?.deposit_balance);
    const demoBalance = nullishToNumber(account?.demo_balance);
    const realBalance = nullishToNumber(account?.real_balance);

    const name = formatDisplayName({
        displayName: profile?.display_name,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        name: profile && "name" in profile ? (profile as any).name : undefined,
    });

    const email = (profile?.email ?? user.email ?? "").trim();
    const memberSince = (profile?.created_at ?? "").toString();

    return {
        name,
        email,
        memberSince,
        depositBalance,
        demoBalance,
        realBalance,
    };
}

