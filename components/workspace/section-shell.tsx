"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarContent } from "@/components/ui/sidebar";
import { ChevronRight, PanelLeftOpen, PanelLeftClose, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BaseItem = {
    id: string;
    label: string;
    icon?: ReactNode;
    active?: boolean;
    href?: string;
    onClick?: () => void;
};

type SecondaryNavItem = BaseItem;
type SecondaryListItem = BaseItem;
type SecondaryListGroup = {
    id: string;
    label: string;
    items: SecondaryListItem[];
};

interface SectionShellProps {
    sectionLabel: string;
    breadcrumbLabel?: string;
    icon?: ReactNode;
    primaryActionLabel?: string;
    onPrimaryActionClick?: () => void;
    secondaryNavItems?: SecondaryNavItem[];
    secondaryListItems?: SecondaryListItem[];
    secondaryListGroups?: SecondaryListGroup[];
    secondaryFooterItems?: SecondaryNavItem[];
    breadcrumbs?: ReactNode;
    topBarRight?: ReactNode;
    showSearch?: boolean;
    contentClassName?: string;
    children: ReactNode;
}

function SecondaryItem({
    item,
    variant,
    className,
    children,
}: {
    item: BaseItem;
    variant: "nav" | "list";
    className?: string;
    children: ReactNode;
}) {
    const base = cn(
        "w-full justify-start gap-2 rounded-md px-3 py-2 text-xs transition-colors",
        "cursor-pointer",
        variant === "nav"
            ? cn(
                "font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.active && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
            )
            : cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground",
                item.active && "bg-muted text-foreground"
            ),
        className
    );

    if (item.href) {
        return (
            <Button asChild variant="ghost" className={base}>
                <Link href={item.href}>{children}</Link>
            </Button>
        );
    }

    return (
        <Button type="button" variant="ghost" className={base} onClick={item.onClick}>
            {children}
        </Button>
    );
}

export function SectionShell({
    sectionLabel,
    breadcrumbLabel,
    icon,
    primaryActionLabel,
    onPrimaryActionClick,
    secondaryNavItems = [],
    secondaryListItems = [],
    secondaryListGroups = [],
    secondaryFooterItems = [],
    breadcrumbs,
    topBarRight,
    showSearch = true,
    contentClassName = "",
    children,
}: SectionShellProps) {
    const crumb = breadcrumbLabel ?? sectionLabel;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-svh w-full">
            {/* Secondary sidebar */}
            {sidebarOpen ? (
                <aside className="flex w-64 flex-col border-r bg-sidebar">
                    <div className="flex h-16 items-center justify-between gap-2 border-b px-4">
                        <div className="flex min-w-0 items-center gap-2">
                            {icon && (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground shadow-sm">
                                    {icon}
                                </div>
                            )}
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold text-sidebar-foreground">
                                    {sectionLabel}
                                </span>
                                <span className="text-xs text-muted-foreground">My workspace</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </Button>
                    </div>

                    <SidebarContent className="flex-1 px-2 py-3">
                        <div className="flex h-full min-h-0 flex-col">
                            <ScrollArea className="min-h-0 flex-1 pr-1">
                                {secondaryNavItems.length > 0 && (
                                    <div className="space-y-1 pb-3">
                                        {secondaryNavItems.map((item) => (
                                            <SecondaryItem key={item.id} item={item} variant="nav">
                                                {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                                                <span className="truncate text-left">{item.label}</span>
                                            </SecondaryItem>
                                        ))}
                                    </div>
                                )}

                                {secondaryListGroups.length > 0 ? (
                                    <div className={cn("space-y-4", secondaryNavItems.length > 0 && "border-t pt-3")}>
                                        {secondaryListGroups.map((group) =>
                                            group.items.length > 0 ? (
                                                <div key={group.id} className="space-y-1">
                                                    <div className="px-3 pb-1 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                                                        {group.label}
                                                    </div>
                                                    {group.items.map((item) => (
                                                        <SecondaryItem key={item.id} item={item} variant="list">
                                                            {item.icon && (
                                                                <span className="text-muted-foreground">{item.icon}</span>
                                                            )}
                                                            <span className="truncate text-left">{item.label}</span>
                                                        </SecondaryItem>
                                                    ))}
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                ) : (
                                    secondaryListItems.length > 0 && (
                                        <div className="space-y-1 border-t pt-3">
                                            {secondaryListItems.map((item) => (
                                                <SecondaryItem key={item.id} item={item} variant="list">
                                                    {item.icon && (
                                                        <span className="text-muted-foreground">{item.icon}</span>
                                                    )}
                                                    <span className="truncate text-left">{item.label}</span>
                                                </SecondaryItem>
                                            ))}
                                        </div>
                                    )
                                )}
                            </ScrollArea>

                            {secondaryFooterItems.length > 0 && (
                                <div className="border-t pt-2">
                                    {secondaryFooterItems.map((item) => (
                                        <SecondaryItem key={item.id} item={item} variant="list">
                                            {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                                            <span className="truncate text-left">{item.label}</span>
                                        </SecondaryItem>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SidebarContent>
                </aside>
            ) : (
                <>
                    {/* Floating expand button when collapsed */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "fixed left-[72px] top-4 z-30 h-9 w-9 rounded-full",
                            "bg-background/80 backdrop-blur-md border border-border/50",
                            "shadow-lg shadow-black/10",
                            "transition-all duration-200",
                            "hover:bg-background hover:scale-105 hover:shadow-xl"
                        )}
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Expand sidebar"
                    >
                        <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                </>
            )}

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col bg-card">
                <header className={cn(
                    "sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur",
                    sidebarOpen ? "px-6" : "pl-16 pr-6"
                )}>
                    <div className="flex min-w-0 items-center gap-3">
                        {breadcrumbs ?? (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <Link href="/workspace" className="hover:text-foreground transition-colors">
                                            Home
                                        </Link>
                                    </BreadcrumbItem>
                                    {crumb !== "Home" && (
                                        <>
                                            <BreadcrumbSeparator />
                                            <BreadcrumbItem>
                                                <span className="text-foreground">{crumb}</span>
                                            </BreadcrumbItem>
                                        </>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}

                        {showSearch && (
                            <div className="relative hidden md:block">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search your workspace..."
                                    className="h-9 w-64 bg-background pl-8 text-xs"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {topBarRight}
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
                    </div>
                </header>

                <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-6", contentClassName)}>
                    {children}
                </div>
            </div>
        </div>
    );
}
