# Contributing to MockAPI

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/MockAPI.git
cd MockAPI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router + API Routes)
- **TypeScript 5**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Lucide React** (icons)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── mock/[...path]/route.ts   # Live mock server
│   │   ├── sync/route.ts             # Client → server data sync
│   │   └── logs/route.ts             # Request log polling
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── EndpointEditor.tsx             # Edit endpoint config + response body
│   ├── EndpointList.tsx               # Endpoint management
│   ├── Header.tsx                     # App header
│   ├── RequestLog.tsx                 # Real-time request viewer
│   ├── SettingsPanel.tsx              # CORS configuration
│   ├── Sidebar.tsx                    # Collections navigation
│   └── ThemeProvider.tsx              # Dark/light mode
├── hooks/
│   └── useSync.ts                     # State → server sync + log polling
├── lib/
│   ├── fake-data.ts                   # Fake data generators + template engine
│   ├── store.ts                       # Zustand store
│   └── utils.ts                       # Route matching, helpers
└── types/
    └── index.ts                       # TypeScript interfaces
```

## How the Mock Server Works

1. Client state (endpoints, CORS config) is synced to `.mockapi-data.json` via the `/api/sync` route
2. The `/api/mock/[...path]` route reads this file to match incoming requests
3. Request logs are written to `.mockapi-log.json` and polled by the UI via `/api/logs`
4. Fake data tokens (`{{fake.name}}`, `{{repeat(n)}}`, etc.) are processed server-side

## Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Zustand for all shared state
- Tailwind CSS for styling
- Support both dark and light themes

### Commits
- Clear, descriptive commit messages
- One feature/fix per commit
- Run `npm run build` before pushing

### Adding Features
1. Fork and create a feature branch
2. Add types to `src/types/index.ts`
3. Update store in `src/lib/store.ts`
4. Server-side changes in `src/app/api/`
5. Test endpoints via browser, curl, or fetch

### Key Design Decisions
- File-based storage (`.mockapi-data.json`) — simple, no database needed
- Client syncs state to server on every change
- Response body supports template syntax with fake data
- CORS is fully configurable per-server

## Areas for Contribution

- Request/response header customization per endpoint
- Conditional responses (match by query param, header, or body)
- WebSocket mock support
- Proxy mode (forward unmatched requests to a real API)
- Response schema validation
- Rate limiting simulation
- Import from OpenAPI/Swagger spec

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
