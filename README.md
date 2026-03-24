# MockAPI ⚡

A local mock API server generator. Create mock REST APIs instantly — define endpoints visually, generate realistic fake data, and serve them from a local server. Built for frontend devs who need a backend fast.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Visual Endpoint Builder** — Define method, path, status code, and response body with a clean UI
- **Fake Data Generators** — Built-in tokens for names, emails, phones, addresses, dates, UUIDs, lorem ipsum, and more
- **Response Templates** — JSON editor with quick-start templates (single object, arrays, paginated lists, errors)
- **Dynamic Route Params** — Use `/:id` in paths and `{{params.id}}` in responses for per-ID data
- **Live Mock Server** — API routes at `/api/mock/*` actually serve your mock data
- **Collections** — Group endpoints by project or feature
- **Import/Export** — Share endpoint definitions as JSON files
- **Request Log** — See incoming requests in real-time with method, path, status, and timing
- **CORS Configuration** — Configurable CORS headers for cross-origin requests
- **Dark/Light Mode** — Developer-focused dark theme with optional light mode

## Quick Start

```bash
git clone https://github.com/your-username/MockAPI.git
cd MockAPI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building mock endpoints.

## How It Works

1. **Create an endpoint** — Click "Add Endpoint", set the method, path, and response body
2. **Use fake data tokens** — Insert `{{fake.name}}`, `{{fake.email}}`, etc. in your response body
3. **Hit the endpoint** — Make requests to `http://localhost:3000/api/mock/your-path`
4. **See the logs** — Check the Request Log tab to see incoming requests

### Fake Data Tokens

Use these in your response body:

| Token | Example Output |
|---|---|
| `{{fake.name}}` | John Smith |
| `{{fake.email}}` | john.smith@gmail.com |
| `{{fake.phone}}` | +1-555-123-4567 |
| `{{fake.address}}` | 1234 Main St |
| `{{fake.city}}` | New York |
| `{{fake.state}}` | NY |
| `{{fake.zip}}` | 10001 |
| `{{fake.country}}` | United States |
| `{{fake.date}}` | 2024-03-15 |
| `{{fake.uuid}}` | a1b2c3d4-e5f6-4... |
| `{{fake.lorem}}` | lorem ipsum dolor... |
| `{{fake.number}}` | 42 |
| `{{fake.boolean}}` | true |
| `{{fake.company}}` | Acme Corp |
| `{{fake.avatar}}` | https://api.dicebear.com/... |
| `{{fake.url}}` | https://example.com/lorem |

### Repeat Blocks

Generate arrays of fake data:

```json
{
  "users": [
    {{repeat(5)}}
    {
      "id": "{{fake.uuid}}",
      "name": "{{fake.name}}",
      "email": "{{fake.email}}"
    }
    {{/repeat}}
  ]
}
```

### Dynamic Route Params

Define a path like `/api/users/:id` and reference it:

```json
{
  "id": "{{params.id}}",
  "name": "{{fake.name}}"
}
```

Requesting `/api/mock/api/users/42` will return `"id": "42"` with consistent fake data per ID.

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router + API Routes
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [Lucide React](https://lucide.dev/) — Icons

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── mock/[...path]/route.ts   # Mock server endpoint
│   │   ├── sync/route.ts             # Client → server data sync
│   │   └── logs/route.ts             # Request log polling
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── EndpointEditor.tsx             # Edit endpoint details + response
│   ├── EndpointList.tsx               # List/manage endpoints
│   ├── Header.tsx                     # App header + theme toggle
│   ├── RequestLog.tsx                 # Real-time request viewer
│   ├── SettingsPanel.tsx              # CORS config
│   ├── Sidebar.tsx                    # Collections + navigation
│   └── ThemeProvider.tsx              # Dark/light mode
├── hooks/
│   └── useSync.ts                     # Sync state to server + poll logs
├── lib/
│   ├── fake-data.ts                   # Fake data generators + template engine
│   ├── store.ts                       # Zustand store
│   └── utils.ts                       # Helpers
└── types/
    └── index.ts                       # TypeScript types
```

## License

[MIT](LICENSE)
