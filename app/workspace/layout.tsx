import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import "tldraw/tldraw.css";


import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ensureUserProfile } from "@/lib/ensureUserProfile";
import { SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: "Workspace | Noma",
};

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await ensureUserProfile();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-h-svh">
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

