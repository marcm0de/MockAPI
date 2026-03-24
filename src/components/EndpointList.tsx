"use client";

import { useStore } from "@/lib/store";
import { HttpMethod } from "@/types";
import { methodColor, cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const DEFAULT_RESPONSE = `{
  "id": "{{fake.uuid}}",
  "name": "{{fake.name}}",
  "email": "{{fake.email}}",
  "createdAt": "{{fake.date}}"
}`;

export function EndpointList() {
  const endpoints = useStore((s) => s.endpoints);
  const activeCollectionId = useStore((s) => s.activeCollectionId);
  const addEndpoint = useStore((s) => s.addEndpoint);
  const deleteEndpoint = useStore((s) => s.deleteEndpoint);
  const duplicateEndpoint = useStore((s) => s.duplicateEndpoint);
  const updateEndpoint = useStore((s) => s.updateEndpoint);
  const selectedEndpointId = useStore((s) => s.selectedEndpointId);
  const setSelectedEndpoint = useStore((s) => s.setSelectedEndpoint);

  const filtered = endpoints.filter(
    (e) => e.collectionId === activeCollectionId
  );

  const handleAdd = () => {
    addEndpoint({
      method: "GET",
      path: "/api/resource",
      statusCode: 200,
      responseBody: DEFAULT_RESPONSE,
      description: "New endpoint",
      delay: 0,
      collectionId: activeCollectionId,
      enabled: true,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        <h2 className="text-sm font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">
          Endpoints
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Endpoint
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <p className="text-sm">No endpoints yet</p>
            <button
              onClick={handleAdd}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Create your first endpoint
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50 dark:divide-gray-800/50 light:divide-gray-200/50">
            {filtered.map((ep) => (
              <div
                key={ep.id}
                onClick={() => setSelectedEndpoint(ep.id)}
                className={cn(
                  "px-4 py-3 cursor-pointer transition-all group hover:bg-gray-800/30 dark:hover:bg-gray-800/30 light:hover:bg-gray-100",
                  selectedEndpointId === ep.id &&
                    "bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 border-l-2 border-emerald-500",
                  !ep.enabled && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0",
                        methodColor(ep.method)
                      )}
                    >
                      {ep.method}
                    </span>
                    <span className="text-sm text-gray-200 dark:text-gray-200 light:text-gray-800 font-mono truncate">
                      {ep.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateEndpoint(ep.id, { enabled: !ep.enabled });
                      }}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title={ep.enabled ? "Disable" : "Enable"}
                    >
                      {ep.enabled ? (
                        <ToggleRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateEndpoint(ep.id);
                      }}
                      className="p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-gray-300 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEndpoint(ep.id);
                      }}
                      className="p-1 hover:bg-gray-700 rounded text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500 truncate">
                    {ep.description}
                  </span>
                  <span className="text-xs text-gray-700">•</span>
                  <span className="text-xs text-gray-600">{ep.statusCode}</span>
                  {ep.delay > 0 && (
                    <>
                      <span className="text-xs text-gray-700">•</span>
                      <span className={`text-xs flex items-center gap-1 ${
                        ep.delay <= 200 ? 'text-yellow-500' :
                        ep.delay <= 1000 ? 'text-orange-500' :
                        'text-red-500'
                      }`}>
                        ⏱ {ep.delay}ms
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
