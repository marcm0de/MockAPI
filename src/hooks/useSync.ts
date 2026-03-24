"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

export function useSync() {
  const endpoints = useStore((s) => s.endpoints);
  const corsConfig = useStore((s) => s.corsConfig);
  const addRequestLog = useStore((s) => s.addRequestLog);
  const lastSyncRef = useRef("");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Sync endpoints + cors to server whenever they change
  useEffect(() => {
    const data = JSON.stringify({ endpoints, corsConfig });
    if (data === lastSyncRef.current) return;
    lastSyncRef.current = data;

    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    }).catch(() => {});
  }, [endpoints, corsConfig]);

  // Poll for new request logs
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/logs");
        if (res.ok) {
          const logs = await res.json();
          if (Array.isArray(logs) && logs.length > 0) {
            // Clear server-side logs after reading
            await fetch("/api/logs", { method: "DELETE" });
            for (const log of logs.reverse()) {
              addRequestLog({
                method: log.method,
                path: log.path,
                query: log.query || {},
                headers: log.headers || {},
                body: log.body,
                matchedEndpointId: log.matchedEndpointId,
                statusCode: log.statusCode,
              });
            }
          }
        }
      } catch {
        // ignore
      }
    };

    pollRef.current = setInterval(poll, 2000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [addRequestLog]);
}
