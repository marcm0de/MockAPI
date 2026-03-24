"use client";

import { useStore } from "@/lib/store";
import { Shield } from "lucide-react";

export function SettingsPanel() {
  const corsConfig = useStore((s) => s.corsConfig);
  const updateCorsConfig = useStore((s) => s.updateCorsConfig);

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-200 dark:text-gray-200 light:text-gray-800">
            CORS Configuration
          </h2>
          <p className="text-xs text-gray-500">
            Configure Cross-Origin Resource Sharing for your mock server
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={corsConfig.enabled}
            onChange={(e) => updateCorsConfig({ enabled: e.target.checked })}
            className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
          />
          <div>
            <span className="text-sm text-gray-200 dark:text-gray-200 light:text-gray-800">
              Enable CORS
            </span>
            <p className="text-xs text-gray-500">
              Add CORS headers to all mock responses
            </p>
          </div>
        </label>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">
            Access-Control-Allow-Origin
          </label>
          <input
            type="text"
            value={corsConfig.allowOrigin}
            onChange={(e) => updateCorsConfig({ allowOrigin: e.target.value })}
            disabled={!corsConfig.enabled}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">
            Access-Control-Allow-Methods
          </label>
          <input
            type="text"
            value={corsConfig.allowMethods}
            onChange={(e) => updateCorsConfig({ allowMethods: e.target.value })}
            disabled={!corsConfig.enabled}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">
            Access-Control-Allow-Headers
          </label>
          <input
            type="text"
            value={corsConfig.allowHeaders}
            onChange={(e) => updateCorsConfig({ allowHeaders: e.target.value })}
            disabled={!corsConfig.enabled}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">
            Access-Control-Max-Age (seconds)
          </label>
          <input
            type="number"
            value={corsConfig.maxAge}
            onChange={(e) =>
              updateCorsConfig({ maxAge: parseInt(e.target.value) || 0 })
            }
            disabled={!corsConfig.enabled}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
        <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
          About MockAPI
        </h3>
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            MockAPI is an open-source local mock API server generator.
          </p>
          <p>
            Create mock endpoints, generate fake data, and test your frontend
            without a real backend.
          </p>
          <p className="text-emerald-500">
            Mock endpoints are served at{" "}
            <code className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 px-1 py-0.5 rounded">
              /api/mock/*
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
