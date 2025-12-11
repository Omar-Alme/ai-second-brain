// app/workspace/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ensureUserProfile } from "@/lib/ensureUserProfile";

export const metadata: Metadata = {
    title: "Workspace | Noma",
};

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await ensureUserProfile();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />   {/* SIDEBAR #1 */}
                <div className="flex flex-1 overflow-hidden">
                    {children}     {/* SIDEBAR #2 lives inside SectionShell */}
                </div>
            </div>
        </SidebarProvider>
    );
}

