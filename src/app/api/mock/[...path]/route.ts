import { NextRequest, NextResponse } from "next/server";
import { processTemplate } from "@/lib/fake-data";
import { matchRoute } from "@/lib/utils";
import { MockEndpoint, CorsConfig } from "@/types";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

// In-memory store for SSR (reads from a JSON file that the client writes)
function getStorageData(): {
  endpoints: MockEndpoint[];
  corsConfig: CorsConfig;
} {
  try {
    const storagePath = path.join(process.cwd(), ".mockapi-data.json");
    if (fs.existsSync(storagePath)) {
      const raw = fs.readFileSync(storagePath, "utf-8");
      const data = JSON.parse(raw);
      return {
        endpoints: data.endpoints || [],
        corsConfig: data.corsConfig || {
          enabled: true,
          allowOrigin: "*",
          allowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          allowHeaders: "Content-Type, Authorization",
          maxAge: 86400,
        },
      };
    }
  } catch {
    // ignore
  }
  return {
    endpoints: [],
    corsConfig: {
      enabled: true,
      allowOrigin: "*",
      allowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      allowHeaders: "Content-Type, Authorization",
      maxAge: 86400,
    },
  };
}

function addCorsHeaders(
  response: NextResponse,
  corsConfig: CorsConfig
): NextResponse {
  if (corsConfig.enabled) {
    response.headers.set(
      "Access-Control-Allow-Origin",
      corsConfig.allowOrigin
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      corsConfig.allowMethods
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      corsConfig.allowHeaders
    );
    response.headers.set(
      "Access-Control-Max-Age",
      String(corsConfig.maxAge)
    );
  }
  return response;
}

function logRequest(
  method: string,
  reqPath: string,
  query: Record<string, string>,
  body: unknown,
  matchedId: string | null,
  statusCode: number
) {
  try {
    const logPath = path.join(process.cwd(), ".mockapi-log.json");
    let logs: unknown[] = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, "utf-8"));
    }
    logs.unshift({
      id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
      method,
      path: reqPath,
      query,
      headers: {},
      body,
      matchedEndpointId: matchedId,
      statusCode,
      timestamp: Date.now(),
    });
    // Keep last 200
    if (logs.length > 200) logs = logs.slice(0, 200);
    fs.writeFileSync(logPath, JSON.stringify(logs));
  } catch {
    // ignore logging errors
  }
}

async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const requestPath = "/" + resolvedParams.path.join("/");
  const method = request.method;
  const { endpoints, corsConfig } = getStorageData();

  // Handle CORS preflight
  if (method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, corsConfig);
  }

  // Find matching endpoint
  let matchedEndpoint: MockEndpoint | null = null;
  let routeParams: Record<string, string> = {};

  for (const ep of endpoints) {
    if (!ep.enabled) continue;
    if (ep.method !== method) continue;

    const matched = matchRoute(ep.path, requestPath);
    if (matched !== null) {
      matchedEndpoint = ep;
      routeParams = matched;
      break;
    }
  }

  // Parse query params
  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  // Parse body
  let body: unknown = null;
  if (method !== "GET" && method !== "HEAD") {
    try {
      body = await request.json();
    } catch {
      // no body or not JSON
    }
  }

  if (!matchedEndpoint) {
    logRequest(method, requestPath, query, body, null, 404);
    const response = NextResponse.json(
      {
        error: "No matching endpoint found",
        path: requestPath,
        method,
        hint: "Define this endpoint in the MockAPI dashboard",
      },
      { status: 404 }
    );
    return addCorsHeaders(response, corsConfig);
  }

  // Apply delay
  if (matchedEndpoint.delay > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, matchedEndpoint!.delay)
    );
  }

  // Process template
  const processedBody = processTemplate(
    matchedEndpoint.responseBody,
    routeParams
  );

  logRequest(
    method,
    requestPath,
    query,
    body,
    matchedEndpoint.id,
    matchedEndpoint.statusCode
  );

  // Try to parse as JSON
  try {
    const jsonBody = JSON.parse(processedBody);
    const response = NextResponse.json(jsonBody, {
      status: matchedEndpoint.statusCode,
    });
    return addCorsHeaders(response, corsConfig);
  } catch {
    // Return as text
    const response = new NextResponse(processedBody, {
      status: matchedEndpoint.statusCode,
      headers: { "Content-Type": "text/plain" },
    });
    return addCorsHeaders(response, corsConfig);
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;
