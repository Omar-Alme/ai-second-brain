"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BillingSnapshot } from "@/lib/billing/types";

type State =
  | { status: "loading"; data: null; error: null }
  | { status: "ready"; data: BillingSnapshot; error: null }
  | { status: "error"; data: null; error: Error };

const BILLING_REFRESH_EVENT = "noma:billing-refresh";

export function useBilling() {
  const [state, setState] = useState<State>({ status: "loading", data: null, error: null });
  const inFlightRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // Cancel any inflight request to avoid racey state updates.
    inFlightRef.current?.abort();
    const controller = new AbortController();
    inFlightRef.current = controller;

    try {
      const res = await fetch("/api/billing/entitlements", {
        method: "GET",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Failed to load billing state (${res.status})`);
      const json = (await res.json()) as BillingSnapshot;
      setState({ status: "ready", data: json, error: null });
    } catch (err) {
      if (controller.signal.aborted) return;
      setState({
        status: "error",
        data: null,
        error: err instanceof Error ? err : new Error("Unknown billing error"),
      });
    } finally {
      if (inFlightRef.current === controller) {
        inFlightRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    refresh();

    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const onCustom = () => refresh();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(BILLING_REFRESH_EVENT, onCustom as EventListener);

    return () => {
      inFlightRef.current?.abort();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(BILLING_REFRESH_EVENT, onCustom as EventListener);
    };
  }, [refresh]);

  return useMemo(() => {
    return {
      ...state,
      entitlements: state.status === "ready" ? state.data.entitlements : null,
      usage: state.status === "ready" ? state.data.usage : null,
      refresh,
    };
  }, [refresh, state]);
}


