"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  FolderOpen,
  Plus,
  Trash2,
  Download,
  Upload,
  Settings,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "endpoints" | "logs" | "settings";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const collections = useStore((s) => s.collections);
  const activeCollectionId = useStore((s) => s.activeCollectionId);
  const setActiveCollection = useStore((s) => s.setActiveCollection);
  const addCollection = useStore((s) => s.addCollection);
  const deleteCollection = useStore((s) => s.deleteCollection);
  const endpoints = useStore((s) => s.endpoints);
  const requestLog = useStore((s) => s.requestLog);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);

  const [newCollName, setNewCollName] = useState("");
  const [showNewColl, setShowNewColl] = useState(false);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mockapi-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const ok = importData(text);
        if (!ok) alert("Invalid import file");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleAddCollection = () => {
    if (newCollName.trim()) {
      addCollection(newCollName.trim());
      setNewCollName("");
      setShowNewColl(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "endpoints", label: "Endpoints", icon: <FolderOpen className="w-4 h-4" /> },
    {
      id: "logs",
      label: "Request Log",
      icon: <Activity className="w-4 h-4" />,
      badge: requestLog.length,
    },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-gray-800 dark:border-gray-800 bg-[#151528] dark:bg-[#151528] light:bg-gray-50 light:border-gray-200 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-800 dark:border-gray-800 light:border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors relative",
              activeTab === tab.id
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-gray-700"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge ? (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center">
                {tab.badge > 99 ? "99+" : tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === "endpoints" && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Collections
            </span>
            <div className="flex gap-1">
              <button
                onClick={handleImport}
                className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors"
                title="Import"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExport}
                className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors"
                title="Export"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowNewColl(true)}
                className="p-1 hover:bg-gray-800 rounded text-gray-500 hover:text-gray-300 transition-colors"
                title="New Collection"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {showNewColl && (
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                value={newCollName}
                onChange={(e) => setNewCollName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCollection()}
                placeholder="Collection name"
                className="flex-1 px-2 py-1 text-xs rounded bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-emerald-500"
                autoFocus
              />
              <button
                onClick={handleAddCollection}
                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Add
              </button>
            </div>
          )}

          {collections.map((coll) => {
            const count = endpoints.filter(
              (e) => e.collectionId === coll.id
            ).length;
            return (
              <button
                key={coll.id}
                onClick={() => setActiveCollection(coll.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group",
                  activeCollectionId === coll.id
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-400 hover:bg-gray-800/50 dark:hover:bg-gray-800/50 light:hover:bg-gray-200/50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="truncate">{coll.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">{count}</span>
                  {coll.id !== "default" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${coll.name}"?`))
                          deleteCollection(coll.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === "endpoints" && (
        <div className="p-3 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            {endpoints.length} endpoint{endpoints.length !== 1 ? "s" : ""} total
          </div>
        </div>
      )}
    </aside>
  );
}
