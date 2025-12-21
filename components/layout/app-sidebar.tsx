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

const mainNav = [
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
         className="border-r border-border/20 bg-sidebar/40 backdrop-blur-xl text-sidebar-foreground h-screen shadow-xl shadow-black/5"
         style={
           {
             "--sidebar-width": "72px",
             "--sidebar-width-icon": "72px",
           } as React.CSSProperties
         }
       >
        {/* 🧱 FIXED: wrap content correctly */}
        <SidebarContent className="flex h-full flex-col">
          
          {/* Top: create button + main nav */}
          <div className="flex-1 pt-4">
            
            {/* Create / add button */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Tooltip>
                      <TooltipTrigger asChild>
                         <SidebarMenuButton
                           className={cn(
                             "mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full",
                             "bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-md",
                             "border border-primary/30 text-primary-foreground",
                             "shadow-lg shadow-primary/25",
                             "transition-all duration-200",
                             "hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:border-primary/50",
                             "active:scale-95",
                             "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                           )}
                           onClick={() => {
                             console.log("Open create menu");
                           }}
                         >
                           <Plus className="h-4 w-4" />
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
                                 "group relative flex h-auto flex-col items-center justify-center gap-1.5 rounded-none py-2.5 text-xs",
                                 "text-muted-foreground/90 transition-all duration-200",
                                 !isActive && "hover:text-foreground"
                               )}
                             >
                               <Link href={item.href} className="flex flex-col items-center gap-1.5 w-full">
                                 <span
                                   className={cn(
                                     "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                                     "backdrop-blur-md border border-border/20",
                                     !isActive && [
                                       "bg-muted/20",
                                       "group-hover:bg-muted/40 group-hover:border-border/40 group-hover:scale-105"
                                     ],
                                     isActive && 
                                       "bg-primary/80 backdrop-blur-md border-primary/30 text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                   )}
                                 >
                                   <Icon className={cn(
                                     "h-4 w-4 transition-colors",
                                     !isActive && "text-foreground/70",
                                     isActive && "text-primary-foreground"
                                   )} />
                                 </span>
                                 <span className={cn(
                                   "text-[10px] font-medium leading-tight tracking-tight transition-colors",
                                   !isActive && "text-foreground/70",
                                   isActive && "text-foreground"
                                 )}>
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
            <SidebarFooter className="mt-auto p-3 border-t border-border/20 bg-sidebar/30 backdrop-blur-md overflow-visible">
             <SidebarMenu>
               <SidebarMenuItem>
                 <SidebarMenuButton
                   className="flex items-center justify-center overflow-visible"
                   asChild
                 >
                   <div className="flex w-full items-center justify-center p-2">
                     <div className="rounded-xl p-2 backdrop-blur-sm border border-transparent bg-transparent transition-all duration-200 hover:border-transparent hover:scale-105 overflow-visible">
                       <UserButton
                         appearance={{
                           elements: {
                             avatarBox: "h-8 w-8 rounded-lg",
                           },
                         }}
                       />
                     </div>
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
