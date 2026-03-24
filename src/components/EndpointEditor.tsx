"use client";

import { useStore } from "@/lib/store";
import { HttpMethod } from "@/types";
import { FAKE_DATA_TYPES } from "@/lib/fake-data";
import { formatJSON } from "@/lib/utils";
import { Wand2, Copy, Check } from "lucide-react";
import { useState } from "react";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];

const TEMPLATES: { name: string; body: string }[] = [
  {
    name: "Single Object",
    body: `{
  "id": "{{fake.uuid}}",
  "name": "{{fake.name}}",
  "email": "{{fake.email}}",
  "avatar": "{{fake.avatar}}",
  "company": "{{fake.company}}",
  "createdAt": "{{fake.date}}"
}`,
  },
  {
    name: "Array of Items",
    body: `{
  "data": [
    {{repeat(5)}}
    {
      "id": "{{fake.uuid}}",
      "name": "{{fake.name}}",
      "email": "{{fake.email}}",
      "phone": "{{fake.phone}}"
    }
    {{/repeat}}
  ],
  "total": 5,
  "page": 1
}`,
  },
  {
    name: "User Profile",
    body: `{
  "id": "{{params.id}}",
  "name": "{{fake.name}}",
  "email": "{{fake.email}}",
  "phone": "{{fake.phone}}",
  "address": {
    "street": "{{fake.address}}",
    "city": "{{fake.city}}",
    "state": "{{fake.state}}",
    "zip": "{{fake.zip}}",
    "country": "{{fake.country}}"
  },
  "avatar": "{{fake.avatar}}",
  "company": "{{fake.company}}"
}`,
  },
  {
    name: "Error Response",
    body: `{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": "The requested resource does not exist"
  }
}`,
  },
  {
    name: "Paginated List",
    body: `{
  "data": [
    {{repeat(10)}}
    {
      "id": "{{fake.uuid}}",
      "title": "{{fake.lorem}}",
      "author": "{{fake.name}}",
      "date": "{{fake.date}}",
      "url": "{{fake.url}}"
    }
    {{/repeat}}
  ],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}`,
  },
];

export function EndpointEditor() {
  const selectedId = useStore((s) => s.selectedEndpointId);
  const endpoints = useStore((s) => s.endpoints);
  const updateEndpoint = useStore((s) => s.updateEndpoint);
  const collections = useStore((s) => s.collections);
  const [copied, setCopied] = useState(false);
  const [showFakeRef, setShowFakeRef] = useState(false);

  const endpoint = endpoints.find((e) => e.id === selectedId);

  if (!endpoint) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center space-y-2">
          <Wand2 className="w-12 h-12 mx-auto text-gray-700" />
          <p className="text-sm">Select an endpoint to edit</p>
          <p className="text-xs text-gray-700">
            Or create a new one from the list
          </p>
        </div>
      </div>
    );
  }

  const handleCopySnippet = () => {
    const snippet = `fetch("http://localhost:3000/api/mock${endpoint.path}", {
  method: "${endpoint.method}",
  headers: { "Content-Type": "application/json" }
})
  .then(res => res.json())
  .then(data => console.log(data));`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatJSON = () => {
    updateEndpoint(endpoint.id, {
      responseBody: formatJSON(endpoint.responseBody),
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6 max-w-3xl">
        {/* Method + Path */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Endpoint
          </label>
          <div className="flex gap-2">
            <select
              value={endpoint.method}
              onChange={(e) =>
                updateEndpoint(endpoint.id, {
                  method: e.target.value as HttpMethod,
                })
              }
              className="px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500 w-28"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={endpoint.path}
              onChange={(e) =>
                updateEndpoint(endpoint.id, { path: e.target.value })
              }
              placeholder="/api/users/:id"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
          <p className="text-xs text-gray-600">
            Use <code className="text-emerald-400">/:param</code> for dynamic
            route params (e.g. /api/users/:id)
          </p>
        </div>

        {/* Description + Status + Delay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">
              Description
            </label>
            <input
              type="text"
              value={endpoint.description}
              onChange={(e) =>
                updateEndpoint(endpoint.id, { description: e.target.value })
              }
              placeholder="Describe this endpoint"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">
              Status Code
            </label>
            <select
              value={endpoint.statusCode}
              onChange={(e) =>
                updateEndpoint(endpoint.id, {
                  statusCode: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
            >
              {STATUS_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-400">
              Delay (ms)
            </label>
            <input
              type="number"
              value={endpoint.delay}
              onChange={(e) =>
                updateEndpoint(endpoint.id, {
                  delay: parseInt(e.target.value) || 0,
                })
              }
              min={0}
              max={30000}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Collection */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-400">
            Collection
          </label>
          <select
            value={endpoint.collectionId}
            onChange={(e) =>
              updateEndpoint(endpoint.id, { collectionId: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-800 light:bg-white border border-gray-700 dark:border-gray-700 light:border-gray-300 text-white dark:text-white light:text-gray-900 text-sm focus:outline-none focus:border-emerald-500"
          >
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Templates */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() =>
                  updateEndpoint(endpoint.id, { responseBody: t.body })
                }
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-700 dark:border-gray-700 light:border-gray-300 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Response Body Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Response Body
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFakeRef(!showFakeRef)}
                className="text-xs text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                {showFakeRef ? "Hide" : "Show"} Fake Data Ref
              </button>
              <button
                onClick={handleFormatJSON}
                className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
              >
                Format JSON
              </button>
            </div>
          </div>
          <textarea
            value={endpoint.responseBody}
            onChange={(e) =>
              updateEndpoint(endpoint.id, { responseBody: e.target.value })
            }
            rows={16}
            spellCheck={false}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-gray-50 border border-gray-700 dark:border-gray-700 light:border-gray-300 text-emerald-300 dark:text-emerald-300 light:text-emerald-700 text-sm font-mono focus:outline-none focus:border-emerald-500 resize-y leading-relaxed"
          />
        </div>

        {/* Fake Data Reference */}
        {showFakeRef && (
          <div className="space-y-2 bg-gray-900/50 dark:bg-gray-900/50 light:bg-gray-50 rounded-lg p-4 border border-gray-800 dark:border-gray-800 light:border-gray-200">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Available Fake Data Tokens
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FAKE_DATA_TYPES.map((fd) => (
                <button
                  key={fd.type}
                  onClick={() => {
                    navigator.clipboard.writeText(`{{fake.${fd.type}}}`);
                  }}
                  className="text-left px-3 py-2 rounded border border-gray-800 dark:border-gray-800 light:border-gray-200 hover:border-emerald-500/50 transition-colors group"
                >
                  <code className="text-xs text-emerald-400 group-hover:text-emerald-300">
                    {"{{"}fake.{fd.type}{"}}"}
                  </code>
                  <p className="text-[10px] text-gray-600 mt-0.5">
                    {fd.label} — {fd.example}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Click to copy. Also available:{" "}
              <code className="text-emerald-500">{"{{params.id}}"}</code>,{" "}
              <code className="text-emerald-500">{"{{index}}"}</code>,{" "}
              <code className="text-emerald-500">
                {"{{repeat(n)}}...{{/repeat}}"}
              </code>
            </p>
          </div>
        )}

        {/* Fetch Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Fetch Snippet
            </label>
            <button
              onClick={handleCopySnippet}
              className="text-xs text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
          <pre className="px-4 py-3 rounded-lg bg-gray-900 dark:bg-gray-900 light:bg-gray-50 border border-gray-800 dark:border-gray-800 light:border-gray-200 text-xs text-gray-400 font-mono overflow-x-auto">
            {`fetch("http://localhost:3000/api/mock${endpoint.path}")
  .then(res => res.json())
  .then(data => console.log(data));`}
          </pre>
        </div>
      </div>
    </div>
  );
}
