"use client";

import { useStore } from "@/lib/store";
import { methodColor, formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";

export function RequestLog() {
  const requestLog = useStore((s) => s.requestLog);
  const clearRequestLog = useStore((s) => s.clearRequestLog);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const selected = requestLog.find((l) => l.id === selectedLog);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        <h2 className="text-sm font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">
          Request Log
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {requestLog.length} request{requestLog.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearRequestLog}
            className="p-1.5 hover:bg-gray-800 rounded text-gray-500 hover:text-red-400 transition-colors"
            title="Clear log"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
            {requestLog.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedLog(entry.id)}
                className={cn(
                  "px-4 py-2.5 cursor-pointer border-b border-gray-800/50 dark:border-gray-800/50 light:border-gray-200/50 hover:bg-gray-800/30 transition-colors",
                  selectedLog === entry.id && "bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100"
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
                  <span className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 font-mono truncate">
                    {entry.path}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs",
                      entry.statusCode < 400
                        ? "text-emerald-500"
                        : "text-red-400"
                    )}
                  >
                    {entry.statusCode}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {formatTimestamp(entry.timestamp)}
                  </span>
                  {!entry.matchedEndpointId && (
                    <span className="text-[10px] text-yellow-500">
                      unmatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selected ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2">
                    Request
                  </h3>
                  <pre className="text-xs text-gray-400 font-mono bg-gray-900 dark:bg-gray-900 light:bg-gray-50 rounded-lg p-3 overflow-x-auto">
                    {`${selected.method} ${selected.path}\n${formatTimestamp(selected.timestamp)}`}
                  </pre>
                </div>
                {Object.keys(selected.query).length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 mb-2">
                      Query Params
                    </h3>
                    <pre className="text-xs text-gray-400 font-mono bg-gray-900 dark:bg-gray-900 light:bg-gray-50 rounded-lg p-3 overflow-x-auto">
                      {JSON.stringify(selected.query, null, 2)}
                    </pre>
                  </div>
                )}
                {selected.body !== null && selected.body !== undefined && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 mb-2">
                      Request Body
                    </h3>
                    <pre className="text-xs text-gray-400 font-mono bg-gray-900 dark:bg-gray-900 light:bg-gray-50 rounded-lg p-3 overflow-x-auto">
                      {JSON.stringify(selected.body, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600 text-xs">
                Select a request to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
