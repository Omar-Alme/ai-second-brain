"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useTransition, useState } from "react";

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
  FileUp,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createNoteAction } from "@/app/workspace/notes/actions";
import { createCanvasAction } from "@/app/workspace/canvas/actions";
import { uploadMediaFileAction } from "@/app/workspace/media/actions";
import { useBilling } from "@/hooks/use-billing";
import { LimitReachedDialog } from "@/components/billing/limit-reached-dialog";
import { toast } from "sonner";

const mainNav = [
  { title: "Home", href: "/workspace", icon: Home },
  { title: "Chat", href: "/workspace/chat", icon: MessagesSquare },
  { title: "Notes", href: "/workspace/notes", icon: PenSquare },
  { title: "Media", href: "/workspace/media", icon: ImageIcon },
  { title: "Canvas", href: "/workspace/canvas", icon: Grid2X2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreating, startCreate] = useTransition();
  const [isUploading, startUpload] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const billing = useBilling();
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitText, setLimitText] = useState<string | null>(null);

  const handleCreateNote = () => {
    if (billing.status === "ready" && billing.entitlements) {
      const limit = billing.entitlements.notesLimit;
      if (limit !== null && (billing.usage?.notesUsed ?? 0) >= limit) {
        setLimitText("You've reached the Free plan note limit. Upgrade to Pro for unlimited notes.");
        setLimitOpen(true);
        return;
      }
    }
    startCreate(async () => {
      try {
        toast.loading("Creating note…", { id: "create-note" });
        const id = await createNoteAction();
        toast.success("Note created", { id: "create-note" });
        router.push(`/workspace/notes/${id}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create note", { id: "create-note" });
        setLimitText(err instanceof Error ? err.message : "Failed to create note");
        setLimitOpen(true);
      }
    });
  };

  const handleCreateCanvas = () => {
    if (billing.status === "ready" && billing.entitlements) {
      const limit = billing.entitlements.canvasesLimit;
      if (limit !== null && (billing.usage?.canvasesUsed ?? 0) >= limit) {
        setLimitText("You've reached the Free plan canvas limit. Upgrade to Pro for unlimited canvases.");
        setLimitOpen(true);
        return;
      }
    }
    startCreate(async () => {
      try {
        toast.loading("Creating canvas…", { id: "create-canvas" });
        const id = await createCanvasAction();
        toast.success("Canvas created", { id: "create-canvas" });
        router.push(`/workspace/canvas/${id}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create canvas", { id: "create-canvas" });
        setLimitText(err instanceof Error ? err.message : "Failed to create canvas");
        setLimitOpen(true);
      }
    });
  };

  const handleUploadMedia = () => {
    if (billing.status === "ready" && billing.entitlements) {
      const limitGb = billing.entitlements.storageLimitGb;
      if (limitGb !== null && (billing.usage?.storageUsedBytes ?? 0) >= (limitGb * 1024 * 1024 * 1024)) {
        setLimitText(`You've reached the Free plan storage limit (${limitGb}GB). Upgrade to Pro for higher storage limits.`);
        setLimitOpen(true);
        return;
      }
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (billing.status === "ready" && billing.entitlements) {
      const limitGb = billing.entitlements.storageLimitGb;
      if (limitGb !== null) {
        const currentStorageBytes = billing.usage?.storageUsedBytes ?? 0;
        const limitBytes = limitGb * 1024 * 1024 * 1024;
        if (currentStorageBytes + file.size > limitBytes) {
          setLimitText(`You've reached the Free plan storage limit (${limitGb}GB). Upgrade to Pro for higher storage limits.`);
          setLimitOpen(true);
          e.target.value = "";
          return;
        }
      }
    }

    startUpload(async () => {
      try {
        toast.loading("Uploading…", { id: "upload-media" });
        const formData = new FormData();
        formData.append("file", file);
        await uploadMediaFileAction(formData);
        toast.success("Uploaded", { id: "upload-media" });
        router.push("/workspace/media");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to upload media", { id: "upload-media" });
        setLimitText(err instanceof Error ? err.message : "Failed to upload media");
        setLimitOpen(true);
      } finally {
        e.target.value = "";
      }
    });
  };

  return (
    <>
      <LimitReachedDialog
        open={limitOpen}
        onOpenChange={setLimitOpen}
        title="Limit Reached"
        description={limitText ?? undefined}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,application/pdf"
      />
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
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuButton
                                className={cn(
                                  "mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full",
                                  "bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-md",
                                  "border border-primary/30 text-primary-foreground",
                                  "shadow-lg shadow-primary/25",
                                  "transition-all duration-200",
                                  "hover:scale-105 hover:shadow-xl hover:shadow-primary/40 hover:border-primary/50",
                                  "active:scale-95",
                                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  (isCreating || isUploading) && "opacity-50 cursor-not-allowed"
                                )}
                                disabled={isCreating || isUploading}
                                aria-label="Create new item"
                              >
                                <Plus className="h-4 w-4" />
                              </SidebarMenuButton>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="text-xs">
                            New item
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent side="right" align="start" className="w-48">
                          <DropdownMenuItem
                            onClick={handleCreateNote}
                            disabled={isCreating || isUploading}
                          >
                            <PenSquare className="mr-2 h-4 w-4" />
                            Create Note
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleCreateCanvas}
                            disabled={isCreating || isUploading}
                          >
                            <Grid2X2 className="mr-2 h-4 w-4" />
                            Create Canvas
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleUploadMedia}
                            disabled={isCreating || isUploading}
                          >
                            <FileUp className="mr-2 h-4 w-4" />
                            Upload Media
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem disabled>
                            <MessagesSquare className="mr-2 h-4 w-4" />
                            Start New Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                                   "text-[11px] font-medium leading-tight tracking-tight transition-colors",
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
    </>
  );
}
