"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    Plus,
    Home,
    MessagesSquare,
    PenSquare,
    Image as ImageIcon,
    Grid2X2,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type MainNavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const mainNav: MainNavItem[] = [
    { title: "Home", href: "/workspace", icon: Home },
    { title: "Chat", href: "/workspace/chat", icon: MessagesSquare },
    { title: "Notes", href: "/workspace/notes", icon: PenSquare },
    { title: "Media", href: "/workspace/media", icon: ImageIcon },
    { title: "Canvas", href: "/workspace/canvas", icon: Grid2X2 },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={100}>
            <Sidebar
                side="left"
                variant="sidebar"
                collapsible="none"
                className="border-r bg-sidebar text-sidebar-foreground"
                style={
                    {
                        "--sidebar-width": "80px",
                        "--sidebar-width-icon": "80px",
                    } as React.CSSProperties
                }
            >
                <SidebarContent className="flex h-full flex-col justify-between">
                    {/* Top: create button + main nav */}
                    <div className="pt-4">
                        {/* Create / add button */}
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    className={cn(
                                                        "mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full",
                                                        "bg-primary text-primary-foreground shadow-md shadow-black/5",
                                                        "transition-all hover:shadow-lg hover:shadow-black/10 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring"
                                                    )}
                                                    onClick={() => {
                                                        // later: open command palette / create menu
                                                        console.log("Open create menu");
                                                    }}
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="text-xs">
                                                New item
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        {/* Main nav icons */}
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {mainNav.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <SidebarMenuButton
                                                            asChild
                                                            isActive={isActive}
                                                            className={cn(
                                                                "flex h-14 flex-col items-center justify-center gap-1 rounded-none border-l-2 text-xs",
                                                                "border-transparent text-muted-foreground/80",
                                                                "hover:border-sidebar-ring hover:bg-muted/60 hover:text-foreground",
                                                                isActive &&
                                                                "border-sidebar-ring bg-muted text-foreground shadow-inner"
                                                            )}
                                                        >
                                                            <Link href={item.href}>
                                                                <Icon className="h-5 w-5" />
                                                                <span className="mt-1 text-[11px] leading-none">
                                                                    {item.title}
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="text-xs">
                                                        {item.title}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </div>

                    {/* Bottom: Clerk avatar */}
                    <SidebarFooter className="border-t bg-sidebar/80 py-3">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    className="flex items-center justify-center hover:bg-muted/60"
                                    asChild
                                >
                                    <div className="flex w-full items-center justify-center py-1">
                                        <UserButton
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-9 w-9",
                                                },
                                            }}
                                        />
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
        </TooltipProvider>
    );
}
