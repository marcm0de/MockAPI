export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface MockEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  statusCode: number;
  responseBody: string;
  description: string;
  delay: number; // ms
  collectionId: string;
  enabled: boolean;
  createdAt: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface RequestLogEntry {
  id: string;
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
  matchedEndpointId: string | null;
  statusCode: number;
  timestamp: number;
}

export interface CorsConfig {
  enabled: boolean;
  allowOrigin: string;
  allowMethods: string;
  allowHeaders: string;
  maxAge: number;
}

export type FakeDataType =
  | "name"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "country"
  | "date"
  | "uuid"
  | "lorem"
  | "number"
  | "boolean"
  | "avatar"
  | "company"
  | "url"
  | "creditCard"
  | "creditCardType"
  | "color"
  | "hexColor"
  | "rgbColor"
  | "latitude"
  | "longitude"
  | "coordinates"
  | "ipv4"
  | "ipv6"
  | "macAddress"
  | "userAgent";

export type Theme = "dark" | "light";
