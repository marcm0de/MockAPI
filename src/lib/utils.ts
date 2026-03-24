export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function methodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    POST: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    PUT: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    PATCH: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    DELETE: "text-red-400 bg-red-400/10 border-red-400/30",
  };
  return colors[method] || "text-gray-400 bg-gray-400/10 border-gray-400/30";
}

export function methodColorLight(method: string): string {
  const colors: Record<string, string> = {
    GET: "text-emerald-700 bg-emerald-100 border-emerald-300",
    POST: "text-blue-700 bg-blue-100 border-blue-300",
    PUT: "text-amber-700 bg-amber-100 border-amber-300",
    PATCH: "text-orange-700 bg-orange-100 border-orange-300",
    DELETE: "text-red-700 bg-red-100 border-red-300",
  };
  return colors[method] || "text-gray-700 bg-gray-100 border-gray-300";
}

export function matchRoute(
  pattern: string,
  path: string
): Record<string, string> | null {
  // Convert /:param to regex groups
  const paramNames: string[] = [];
  const regexStr = pattern.replace(/:(\w+)/g, (_match, name) => {
    paramNames.push(name);
    return "([^/]+)";
  });

  const regex = new RegExp(`^${regexStr}$`);
  const match = path.match(regex);

  if (!match) return null;

  const params: Record<string, string> = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });

  return params;
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatJSON(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}
