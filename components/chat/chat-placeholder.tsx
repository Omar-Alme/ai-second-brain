"use client";

import { Paperclip, Globe, Send, ChevronDown, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatPlaceholder() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Coming soon</span>
          </div>
          
          <h1 className="mb-8 text-2xl font-semibold">Start a new chat</h1>
          
          <div className="relative">
            <div className="rounded-3xl border border-border bg-background/60 shadow-sm backdrop-blur">
              <div className="relative">
                <Input
                  placeholder="Ask anything..."
                  disabled
                  className="min-h-[200px] border-0 bg-transparent px-4 py-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled
                    aria-label="Attach file"
                  >
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled
                    aria-label="Web search"
                  >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-full text-xs"
                        disabled
                      >
                        Best
                        <ChevronDown className="ml-1.5 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>Coming soon</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button
                    className="h-8 w-8 rounded-full bg-primary p-0 hover:bg-primary/90"
                    disabled
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

