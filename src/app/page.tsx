"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { EndpointList } from "@/components/EndpointList";
import { EndpointEditor } from "@/components/EndpointEditor";
import { RequestLog } from "@/components/RequestLog";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useSync } from "@/hooks/useSync";

type Tab = "endpoints" | "logs" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("endpoints");
  useSync();

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 min-h-0">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 flex min-h-0">
            {activeTab === "endpoints" && (
              <>
                <div className="w-[380px] border-r border-gray-800 dark:border-gray-800 light:border-gray-200 flex-shrink-0">
                  <EndpointList />
                </div>
                <EndpointEditor />
              </>
            )}
            {activeTab === "logs" && (
              <div className="flex-1">
                <RequestLog />
              </div>
            )}
            {activeTab === "settings" && (
              <div className="flex-1 overflow-y-auto">
                <SettingsPanel />
              </div>
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
