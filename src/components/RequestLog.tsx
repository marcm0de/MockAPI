"use client";

import { useStore } from "@/lib/store";
import { methodColor, formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Trash2, RefreshCw, Clock, Globe, ArrowRight, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function RequestLog() {
  const requestLog = useStore((s) => s.requestLog);
  const clearRequestLog = useStore((s) => s.clearRequestLog);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const selected = requestLog.find((l) => l.id === selectedLog);

  const filteredLog = filter === "all"
    ? requestLog
    : requestLog.filter((l) => l.method === filter.toUpperCase());

  const methodCounts = requestLog.reduce((acc, l) => {
    acc[l.method] = (acc[l.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleCopyResponse = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (code: number) => {
    if (code < 300) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (code < 400) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    if (code < 500) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    return "bg-red-500/15 text-red-400 border-red-500/30";
  };

  const getTimeDiff = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 1000) return "just now";
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">
            Request Log
          </h2>
          {requestLog.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                  filter === "all" ? "bg-blue-500/20 text-blue-400" : "text-gray-500 hover:text-gray-300"
                )}
              >
                All ({requestLog.length})
              </button>
              {Object.entries(methodCounts).map(([method, count]) => (
                <button
                  key={method}
                  onClick={() => setFilter(filter === method.toLowerCase() ? "all" : method.toLowerCase())}
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium transition-colors",
                    filter === method.toLowerCase() ? "bg-blue-500/20 text-blue-400" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {method} ({count})
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={clearRequestLog}
          className="p-1.5 hover:bg-gray-800 rounded text-gray-500 hover:text-red-400 transition-colors"
          title="Clear log"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {requestLog.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600">
          <div className="text-center space-y-2">
            <RefreshCw className="w-10 h-10 mx-auto text-gray-700" />
            <p className="text-sm">No requests yet</p>
            <p className="text-xs text-gray-700">
              Make a request to /api/mock/* to see it here
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          {/* List */}
          <div className="w-1/2 overflow-y-auto border-r border-gray-800 dark:border-gray-800 light:border-gray-200">
            <AnimatePresence initial={false}>
              {filteredLog.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => setSelectedLog(entry.id)}
                  className={cn(
                    "px-4 py-3 cursor-pointer border-b border-gray-800/50 dark:border-gray-800/50 light:border-gray-200/50 hover:bg-gray-800/30 transition-all",
                    selectedLog === entry.id && "bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 border-l-2 border-l-blue-500"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase",
                        methodColor(entry.method)
                      )}
                    >
                      {entry.method}
                    </span>
                    <span className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 font-mono truncate flex-1">
                      {entry.path}
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                        getStatusBadge(entry.statusCode)
                      )}
                    >
                      {entry.statusCode}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-600">
                      <Clock className="w-2.5 h-2.5" />
                      {getTimeDiff(entry.timestamp)}
                    </span>
                    {!entry.matchedEndpointId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">
                        unmatched
                      </span>
                    )}
                    {Object.keys(entry.query).length > 0 && (
                      <span className="text-[10px] text-gray-600">
                        ?{Object.keys(entry.query).length} params
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Detail */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selected ? (
              <div className="space-y-4">
                {/* Request summary */}
                <div className="flex items-center gap-2 pb-3 border-b border-gray-800">
                  <span className={cn("text-xs font-bold px-2 py-1 rounded border uppercase", methodColor(selected.method))}>
                    {selected.method}
                  </span>
                  <span className={cn("text-xs font-medium px-2 py-1 rounded border", getStatusBadge(selected.statusCode))}>
                    {selected.statusCode}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(selected.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* Path */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Request URL
                    </h3>
                    <button
                      onClick={() => handleCopyResponse(selected.path, `path-${selected.id}`)}
                      className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {copiedId === `path-${selected.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <pre className="text-xs text-blue-400 font-mono bg-gray-900 dark:bg-gray-900 light:bg-gray-50 rounded-lg p-3 overflow-x-auto border border-gray-800">
                    {selected.path}
                  </pre>
                </div>

                {/* Timestamp */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Timestamp
                  </h3>
                  <p className="text-xs text-gray-400 font-mono bg-gray-900 rounded-lg p-3 border border-gray-800">
                    {new Date(selected.timestamp).toISOString()}
                  </p>
                </div>

                {Object.keys(selected.query).length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-xs font-semibold text-gray-400">
                        Query Params
                      </h3>
                      <button
                        onClick={() => handleCopyResponse(JSON.stringify(selected.query, null, 2), `query-${selected.id}`)}
                        className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {copiedId === `query-${selected.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 space-y-1">
                      {Object.entries(selected.query).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 text-xs font-mono">
                          <span className="text-purple-400">{key}</span>
                          <span className="text-gray-600">=</span>
                          <span className="text-emerald-400">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selected.body !== null && selected.body !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-xs font-semibold text-gray-400">
                        Request Body
                      </h3>
                      <button
                        onClick={() => handleCopyResponse(JSON.stringify(selected.body, null, 2), `body-${selected.id}`)}
                        className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {copiedId === `body-${selected.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-400 font-mono bg-gray-900 dark:bg-gray-900 light:bg-gray-50 rounded-lg p-3 overflow-x-auto border border-gray-800">
                      {JSON.stringify(selected.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                <div className="text-center space-y-2">
                  <ArrowRight className="w-6 h-6 mx-auto text-gray-700" />
                  <p>Select a request to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
