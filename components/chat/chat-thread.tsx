"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDown, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBilling } from "@/hooks/use-billing";
import { UpgradeToProButton } from "@/components/billing/upgrade-to-pro-button";
import { DEFAULT_OPENROUTER_MODEL, OPENROUTER_MODELS } from "@/lib/ai/openrouterModels";

type Msg = { id: string; role: "user" | "assistant"; content: string };

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ChatThread(props: {
  initialSessionId: string;
  initialMessages: Msg[];
  onCreatedSession: (sessionId: string) => void;
}) {
  const billing = useBilling();
  const [sessionId, setSessionId] = useState(props.initialSessionId);
  const [messages, setMessages] = useState<Msg[]>(props.initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [model, setModel] = useState<string>(DEFAULT_OPENROUTER_MODEL);

  const quota = useMemo(() => {
    if (billing.status !== "ready" || !billing.entitlements || !billing.usage) {
      return { blocked: false, label: "Loading plan…", remaining: null as number | null };
    }
    const limit = billing.entitlements.aiMessagesLimit;
    const used = billing.usage.aiMessagesUsed;
    const remaining = Math.max(0, limit - used);
    return {
      blocked: remaining <= 0,
      remaining,
      label: billing.entitlements.isPro ? "per month" : "total",
    };
  }, [billing.entitlements, billing.status, billing.usage]);

  const empty = messages.length === 0;

  async function send() {
    const msg = input.trim();
    if (!msg || sending) return;
    if (quota.blocked) return;

    setSending(true);
    setError(null);
    setInput("");

    const userMsg: Msg = { id: uid(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: msg,
          sessionId: sessionId || undefined,
          model,
        }),
      });

      const json = (await res.json()) as {
        response?: string;
        sessionId?: string;
        error?: string;
      };

      if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);

      const nextSessionId = (json.sessionId ?? "").trim();
      if (nextSessionId && !sessionId) {
        setSessionId(nextSessionId);
        props.onCreatedSession(nextSessionId);
      }

      const assistant = (json.response ?? "").trim() || "I don’t know.";
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: assistant }]);

      billing.refresh?.();
      queueMicrotask(() => bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b bg-background/40 px-6 py-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{empty ? "Start a new chat" : "Chat"}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {quota.remaining === null ? quota.label : `${quota.remaining} messages remaining (${quota.label})`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                {model.includes(":free") ? "Best (free)" : "Best"} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              {OPENROUTER_MODELS.map((m) => (
                <DropdownMenuItem key={m} onSelect={() => setModel(m)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {quota.blocked && <UpgradeToProButton className="rounded-full" />}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 px-6 py-6">
        {empty ? (
          <div className="mx-auto mt-24 max-w-2xl text-center">
            <div className="text-xl font-semibold tracking-tight">Ask anything about your workspace</div>
            <p className="mt-2 text-sm text-muted-foreground">
              I’ll answer using only your saved notes and canvases.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl border border-border bg-background px-4 py-2 text-sm"
                }
              >
                {m.content}
              </div>
            ))}
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <div className="border-t bg-background/40 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={quota.blocked ? "Upgrade to continue" : "Ask anything…"}
            disabled={sending || quota.blocked}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
            className="h-11"
          />
          <Button
            className="h-11 w-11 rounded-full p-0"
            onClick={() => void send()}
            disabled={sending || quota.blocked || !input.trim()}
            aria-label="Send"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="mx-auto mt-2 max-w-3xl text-[11px] text-muted-foreground">
          Answers are limited to your saved notes/canvases (MVP, no semantic search yet).
        </div>
      </div>
    </div>
  );
}


