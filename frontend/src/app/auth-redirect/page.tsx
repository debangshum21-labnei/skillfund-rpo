import { redirect } from "next/navigation";

type PageProps = {
    searchParams?: Promise<{ next?: string }>;
};

export default async function AuthRedirectPage({ searchParams }: PageProps) {
    const sp = searchParams ? await searchParams : undefined;
    const next = sp?.next ?? "/dashboard";
    redirect(next);
}




