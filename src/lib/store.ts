"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MockEndpoint,
  Collection,
  RequestLogEntry,
  CorsConfig,
  Theme,
  HttpMethod,
} from "@/types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

const DEFAULT_COLLECTION: Collection = {
  id: "default",
  name: "Default",
  description: "Default collection",
  createdAt: Date.now(),
};

const DEFAULT_CORS: CorsConfig = {
  enabled: true,
  allowOrigin: "*",
  allowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  allowHeaders: "Content-Type, Authorization",
  maxAge: 86400,
};

interface AppState {
  // Endpoints
  endpoints: MockEndpoint[];
  addEndpoint: (endpoint: Omit<MockEndpoint, "id" | "createdAt">) => void;
  updateEndpoint: (id: string, updates: Partial<MockEndpoint>) => void;
  deleteEndpoint: (id: string) => void;
  duplicateEndpoint: (id: string) => void;

  // Collections
  collections: Collection[];
  activeCollectionId: string;
  addCollection: (name: string, description?: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  setActiveCollection: (id: string) => void;

  // Request log
  requestLog: RequestLogEntry[];
  addRequestLog: (entry: Omit<RequestLogEntry, "id" | "timestamp">) => void;
  clearRequestLog: () => void;

  // CORS
  corsConfig: CorsConfig;
  updateCorsConfig: (updates: Partial<CorsConfig>) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // UI state
  selectedEndpointId: string | null;
  setSelectedEndpoint: (id: string | null) => void;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Endpoints
      endpoints: [],
      addEndpoint: (endpoint) =>
        set((state) => ({
          endpoints: [
            ...state.endpoints,
            { ...endpoint, id: generateId(), createdAt: Date.now() },
          ],
        })),
      updateEndpoint: (id, updates) =>
        set((state) => ({
          endpoints: state.endpoints.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      deleteEndpoint: (id) =>
        set((state) => ({
          endpoints: state.endpoints.filter((e) => e.id !== id),
          selectedEndpointId:
            state.selectedEndpointId === id ? null : state.selectedEndpointId,
        })),
      duplicateEndpoint: (id) =>
        set((state) => {
          const original = state.endpoints.find((e) => e.id === id);
          if (!original) return state;
          return {
            endpoints: [
              ...state.endpoints,
              {
                ...original,
                id: generateId(),
                path: `${original.path}-copy`,
                description: `${original.description} (copy)`,
                createdAt: Date.now(),
              },
            ],
          };
        }),

      // Collections
      collections: [DEFAULT_COLLECTION],
      activeCollectionId: "default",
      addCollection: (name, description = "") =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: generateId(),
              name,
              description,
              createdAt: Date.now(),
            },
          ],
        })),
      updateCollection: (id, updates) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteCollection: (id) =>
        set((state) => {
          if (id === "default") return state;
          return {
            collections: state.collections.filter((c) => c.id !== id),
            endpoints: state.endpoints.map((e) =>
              e.collectionId === id ? { ...e, collectionId: "default" } : e
            ),
            activeCollectionId:
              state.activeCollectionId === id
                ? "default"
                : state.activeCollectionId,
          };
        }),
      setActiveCollection: (id) => set({ activeCollectionId: id }),

      // Request log
      requestLog: [],
      addRequestLog: (entry) =>
        set((state) => ({
          requestLog: [
            { ...entry, id: generateId(), timestamp: Date.now() },
            ...state.requestLog,
          ].slice(0, 200), // Keep last 200
        })),
      clearRequestLog: () => set({ requestLog: [] }),

      // CORS
      corsConfig: DEFAULT_CORS,
      updateCorsConfig: (updates) =>
        set((state) => ({
          corsConfig: { ...state.corsConfig, ...updates },
        })),

      // Theme
      theme: "dark" as Theme,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      // UI
      selectedEndpointId: null,
      setSelectedEndpoint: (id) => set({ selectedEndpointId: id }),

      // Import/Export
      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            collections: state.collections,
            endpoints: state.endpoints,
            corsConfig: state.corsConfig,
          },
          null,
          2
        );
      },
      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          if (!data.version || !data.endpoints) return false;
          set({
            collections: data.collections || [DEFAULT_COLLECTION],
            endpoints: (data.endpoints as MockEndpoint[]).map((e) => ({
              ...e,
              id: e.id || generateId(),
              method: (e.method || "GET") as HttpMethod,
              statusCode: e.statusCode || 200,
              enabled: e.enabled !== false,
              delay: e.delay || 0,
              collectionId: e.collectionId || "default",
            })),
            corsConfig: data.corsConfig || DEFAULT_CORS,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "mockapi-storage",
      partialize: (state) => ({
        endpoints: state.endpoints,
        collections: state.collections,
        corsConfig: state.corsConfig,
        theme: state.theme,
      }),
    }
  )
);
