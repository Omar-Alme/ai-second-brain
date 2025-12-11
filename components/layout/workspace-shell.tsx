'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
    Sidebar,
    SidebarInset,
    SidebarProvider,
    SidebarRail,
} from '@/components/ui/sidebar';
import {
    Plus,
    Home,
    MessageCircle,
    Image as ImageIcon,
    StickyNote,
    LayoutTemplate,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navItems: NavItem[] = [
    { label: 'Home', href: '/workspace', icon: Home },
    { label: 'Chat', href: '/workspace/chat', icon: MessageCircle },
    { label: 'Media', href: '/workspace/media', icon: ImageIcon },
    { label: 'Notes', href: '/workspace/notes', icon: StickyNote },
    { label: 'Canvas', href: '/workspace/canvas', icon: LayoutTemplate },
];

interface WorkspaceShellProps {
    children: React.ReactNode;
}

export function WorkspaceShell({ children }: WorkspaceShellProps) {
    const pathname = usePathname();

    const currentNav = navItems.find((item) =>
        pathname === '/workspace'
            ? item.href === '/workspace'
            : pathname.startsWith(item.href),
    );

    const headerTitle = currentNav?.label ?? 'Workspace';

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background text-foreground">
                {/* PRIMARY SIDEBAR */}
                <Sidebar className="flex flex-col items-center border-r border-sidebar-border bg-sidebar py-4">
                    {/* Add / create button (we'll wire it later) */}
                    <button
                        className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-sm transition hover:shadow-md"
                        aria-label="Add"
                    >
                        <Plus className="h-5 w-5" />
                    </button>

                    {/* Navigation icons */}
                    <nav className="flex flex-1 flex-col items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive =
                                pathname === item.href ||
                                (item.href !== '/workspace' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-xs transition',
                                        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:border-sidebar-ring/40',
                                        isActive &&
                                        'bg-sidebar-primary text-sidebar-primary-foreground border-sidebar-ring shadow-sm',
                                    )}
                                >
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                    <span className="sr-only">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Clerk avatar at the bottom */}
                    <div className="mt-4">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox:
                                        'h-9 w-9 rounded-full border border-sidebar-border shadow-sm bg-card',
                                },
                            }}
                        />
                    </div>

                    {/* Rail for future collapse behaviour */}
                    <SidebarRail />
                </Sidebar>

                {/* MAIN AREA */}
                <SidebarInset className="flex min-h-screen flex-1 flex-col">
                    {/* Simple header that reflects current section */}
                    <header className="flex h-14 items-center border-b border-border px-6">
                        <h1 className="text-sm font-semibold tracking-tight">
                            {headerTitle}
                        </h1>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-background px-6 py-8">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
