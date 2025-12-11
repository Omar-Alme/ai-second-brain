"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    SidebarInset,
    SidebarContent,
} from "@/components/ui/sidebar";
import {
    ChevronRight,
    PanelLeftOpen,
    PanelLeftClose,
    Search,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type SecondaryNavItem = {
    id: string;
    label: string;
    icon?: ReactNode;
    active?: boolean;
};

type SecondaryListItem = {
    id: string;
    label: string;
    icon?: ReactNode;
    active?: boolean;
};

interface SectionShellProps {
    sectionLabel: string;
    breadcrumbLabel?: string;
    icon?: ReactNode;
    primaryActionLabel?: string;
    onPrimaryActionClick?: () => void;
    secondaryNavItems?: SecondaryNavItem[];
    /** e.g. “test note”, “test canvas” etc. */
    secondaryListItems?: SecondaryListItem[];
    children: ReactNode;
}

export function SectionShell({
    sectionLabel,
    breadcrumbLabel,
    icon,
    primaryActionLabel,
    onPrimaryActionClick,
    secondaryNavItems = [],
    secondaryListItems = [],
    children,
}: SectionShellProps) {
    const crumb = breadcrumbLabel ?? sectionLabel;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen flex-1">
            {/* Collapsible secondary sidebar */}
            {sidebarOpen && (
                <aside className="flex min-w-48 flex-col border-r bg-sidebar">
                    {/* Section header */}
                    <div className="flex h-16 items-center gap-2 border-b px-4">
                        {icon && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground shadow-sm">
                                {icon}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-sidebar-foreground">
                                {sectionLabel}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                My workspace
                            </span>
                        </div>
                    </div>

                    {/* Content: actions + list */}
                    <SidebarContent className="flex-1 px-2 py-3">
                        <ScrollArea className="h-full pr-1">
                            {/* Top actions: “New X”, “All X” */}
                            {secondaryNavItems.length > 0 && (
                                <div className="space-y-1 pb-3">
                                    {secondaryNavItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium",
                                                "transition-colors",
                                                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                                item.active &&
                                                "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                            )}
                                        >
                                            {item.icon && (
                                                <span className="text-muted-foreground">
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="truncate text-left">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Divider + list of items */}
                            {secondaryListItems.length > 0 && (
                                <div className="space-y-1 border-t pt-3">
                                    {secondaryListItems.map((item) => (
                                        <button
                                            key={item.id}
                                            className={cn(
                                                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs",
                                                "text-muted-foreground transition-colors",
                                                "hover:bg-muted hover:text-foreground",
                                                item.active && "bg-muted text-foreground"
                                            )}
                                        >
                                            {item.icon && (
                                                <span className="text-muted-foreground">
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="truncate text-left">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </SidebarContent>
                </aside>
            )}

            {/* Main content column */}
            <div className="flex min-w-0 flex-1 flex-col bg-card">
                {/* Top bar */}
                <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                        {/* toggle secondary sidebar */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setSidebarOpen((prev) => !prev)}
                            aria-label={
                                sidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                            }
                        >
                            {sidebarOpen ? (
                                <PanelLeftClose className="h-4 w-4" />
                            ) : (
                                <PanelLeftOpen className="h-4 w-4" />
                            )}
                        </Button>

                        {/* breadcrumb chip */}
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            {icon && <span className="text-xs">{icon}</span>}
                            {crumb}
                        </span>

                        {/* search */}
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search your workspace..."
                                className="h-9 w-64 bg-background pl-8 text-xs"
                            />
                        </div>
                    </div>

                    {primaryActionLabel && (
                        <Button
                            size="sm"
                            className="rounded-full px-4 text-xs font-medium"
                            onClick={onPrimaryActionClick}
                        >
                            <ChevronRight className="mr-1 h-4 w-4" />
                            {primaryActionLabel}
                        </Button>
                    )}
                </header>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
