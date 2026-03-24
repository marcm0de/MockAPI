import { FakeDataType } from "@/types";

const firstNames = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Emma", "Oliver", "Ava", "Liam", "Sophia",
  "Noah", "Isabella", "Elijah", "Mia", "Lucas", "Charlotte", "Mason", "Amelia",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
];

const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.io", "work.dev", "mail.org"];

const streets = [
  "Main St", "Oak Ave", "Pine Rd", "Elm St", "Cedar Ln", "Maple Dr",
  "Washington Blvd", "Park Ave", "Broadway", "Lake Dr", "Hill St", "River Rd",
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "Austin", "Portland", "Seattle",
  "Denver", "Boston", "Nashville", "Miami", "Atlanta", "Minneapolis",
];

const states = [
  "CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI",
  "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI",
];

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany",
  "France", "Japan", "Brazil", "India", "Mexico", "Spain", "Italy",
];

const companies = [
  "Acme Corp", "Globex Inc", "Initech", "Umbrella Corp", "Stark Industries",
  "Wayne Enterprises", "Cyberdyne Systems", "Soylent Corp", "Massive Dynamic",
  "Hooli", "Pied Piper", "Dunder Mifflin", "Sterling Cooper", "Wonka Industries",
];

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateLorem(words = 10): string {
  return Array.from({ length: words }, () => rand(loremWords)).join(" ");
}

export function generateFakeData(type: FakeDataType, seed?: string): string | number | boolean {
  // Use seed for deterministic-ish results per ID
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    // Seed Math.random isn't possible natively, but we can use hash for array indexing
    const idx = Math.abs(hash);
    switch (type) {
      case "name":
        return `${firstNames[idx % firstNames.length]} ${lastNames[(idx * 7) % lastNames.length]}`;
      case "firstName":
        return firstNames[idx % firstNames.length];
      case "lastName":
        return lastNames[idx % lastNames.length];
      case "email": {
        const fn = firstNames[idx % firstNames.length].toLowerCase();
        const ln = lastNames[(idx * 3) % lastNames.length].toLowerCase();
        return `${fn}.${ln}@${domains[idx % domains.length]}`;
      }
      case "uuid":
        return `${seed.padStart(8, "0").slice(0, 8)}-${generateUUID().slice(9)}`;
      default:
        break;
    }
  }

  switch (type) {
    case "name":
      return `${rand(firstNames)} ${rand(lastNames)}`;
    case "firstName":
      return rand(firstNames);
    case "lastName":
      return rand(lastNames);
    case "email": {
      const fn = rand(firstNames).toLowerCase();
      const ln = rand(lastNames).toLowerCase();
      return `${fn}.${ln}@${rand(domains)}`;
    }
    case "phone":
      return `+1-${randInt(200, 999)}-${randInt(100, 999)}-${randInt(1000, 9999)}`;
    case "address":
      return `${randInt(100, 9999)} ${rand(streets)}`;
    case "city":
      return rand(cities);
    case "state":
      return rand(states);
    case "zip":
      return String(randInt(10000, 99999));
    case "country":
      return rand(countries);
    case "date": {
      const start = new Date(2020, 0, 1).getTime();
      const end = new Date(2026, 11, 31).getTime();
      return new Date(randInt(start, end)).toISOString().split("T")[0];
    }
    case "uuid":
      return generateUUID();
    case "lorem":
      return generateLorem(randInt(5, 20));
    case "number":
      return randInt(1, 10000);
    case "boolean":
      return Math.random() > 0.5;
    case "avatar":
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randInt(1, 99999)}`;
    case "company":
      return rand(companies);
    case "url":
      return `https://${rand(["example", "test", "demo", "sample"])}.${rand(["com", "io", "dev", "org"])}/${rand(loremWords)}`;
    default:
      return "";
  }
}

export function processTemplate(template: string, routeParams: Record<string, string> = {}): string {
  let result = template;

  // Replace route params: {{params.id}} etc.
  for (const [key, value] of Object.entries(routeParams)) {
    result = result.replace(new RegExp(`\\{\\{params\\.${key}\\}\\}`, "g"), value);
  }

  // Replace fake data tokens: {{fake.type}}
  const fakePattern = /\{\{fake\.(\w+)\}\}/g;
  result = result.replace(fakePattern, (_match, type: string) => {
    const seed = routeParams["id"] || undefined;
    return String(generateFakeData(type as FakeDataType, seed));
  });

  // Replace {{repeat(n)}}...{{/repeat}} blocks
  const repeatPattern = /\{\{repeat\((\d+)\)\}\}([\s\S]*?)\{\{\/repeat\}\}/g;
  result = result.replace(repeatPattern, (_match, countStr: string, body: string) => {
    const count = parseInt(countStr, 10);
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      let item = body;
      item = item.replace(fakePattern, (_m, type: string) => {
        return String(generateFakeData(type as FakeDataType));
      });
      item = item.replace(/\{\{index\}\}/g, String(i));
      items.push(item.trim());
    }
    return items.join(",\n");
  });

  return result;
}

export const FAKE_DATA_TYPES: { type: FakeDataType; label: string; example: string }[] = [
  { type: "name", label: "Full Name", example: "John Smith" },
  { type: "firstName", label: "First Name", example: "John" },
  { type: "lastName", label: "Last Name", example: "Smith" },
  { type: "email", label: "Email", example: "john.smith@gmail.com" },
  { type: "phone", label: "Phone", example: "+1-555-123-4567" },
  { type: "address", label: "Address", example: "1234 Main St" },
  { type: "city", label: "City", example: "New York" },
  { type: "state", label: "State", example: "NY" },
  { type: "zip", label: "Zip Code", example: "10001" },
  { type: "country", label: "Country", example: "United States" },
  { type: "date", label: "Date", example: "2024-03-15" },
  { type: "uuid", label: "UUID", example: "a1b2c3d4-..." },
  { type: "lorem", label: "Lorem Ipsum", example: "lorem ipsum dolor..." },
  { type: "number", label: "Number", example: "42" },
  { type: "boolean", label: "Boolean", example: "true" },
  { type: "avatar", label: "Avatar URL", example: "https://..." },
  { type: "company", label: "Company", example: "Acme Corp" },
  { type: "url", label: "URL", example: "https://example.com" },
];
