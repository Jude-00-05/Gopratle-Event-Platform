# GoPratle Event Platform Guidelines

## Build, lint, and test

This repository contains independent `frontend` and `backend` npm applications. Install their locked dependencies from the repository root:

```bash
npm ci --prefix backend
npm ci --prefix frontend
```

Run local development in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Build either application with:

```bash
npm run build:backend
npm run build:frontend
```

The frontend lint command is:

```bash
npm --prefix frontend run lint
```

There is currently no test script, test runner, or CI workflow. There is therefore no single-test command; for a focused frontend change, lint the changed file directly, for example:

```bash
npm --prefix frontend exec eslint src/components/ui/Button.tsx
```

Use `npm --prefix backend run build` or `npm --prefix frontend run build` as the available TypeScript/build validation for backend or frontend changes.

## Architecture

- The frontend is a Next.js 16 App Router application under `frontend/src/app`. The main routes are `/`, `/requirements`, and `/requirements/new`.
- The requirement creation flow is a client-side four-step form. `useMultiStepForm` accumulates Step 1 data and category-specific Step 2/3 data, then `StepFour` submits the combined payload. The selected category (`planner`, `performer`, or `crew`) determines which step components render.
- Form state is persisted in the current tab's `sessionStorage` under the versioned key `gopratle_form_v1`. Category changes after details exist require confirmation and clear the category-specific details. Successful submission and reset clear persisted state.
- `frontend/src/lib/api.ts` is the browser/API boundary. `NEXT_PUBLIC_API_URL` is an API base URL, not an endpoint; the client constructs `/api/requirements` itself. Date-only form values are converted to ISO datetimes before submission.
- The backend is an Express application in `backend/src/app.ts`. `backend/src/server.ts` is only the local listener and database-startup entrypoint; keep the exported app in `app.ts` usable by Vercel.
- Backend request flow is route -> controller -> Zod schema -> Mongoose model. `GET /api/requirements` returns newest-first documents; `POST /api/requirements` validates the complete discriminated payload before persisting it. `/health` is a lightweight process health endpoint and does not check MongoDB.
- MongoDB connections are cached in `backend/src/config/db.ts`; reuse `connectDB()` rather than opening a client per request. `details` is intentionally a Mongoose `Mixed` field because category-specific structure is enforced by Zod.

## Conventions

- Keep client and server schemas aligned. The server's `requirementPayloadSchema` is authoritative at the API boundary and uses a discriminated union on `category`; add category-specific fields to the matching client types, client schema, form step, server schema, and display behavior.
- Keep dates as `YYYY-MM-DD` strings while editing the form, convert them with `toISODateTime` for the API, and convert them to `Date` objects in the controller before Mongoose persistence.
- Use the `@/*` frontend path alias for imports from `frontend/src`; follow the existing CSS Modules pattern for component/page styling.
- Preserve the API response shape: success responses use `{ success: true, data }`; validation and handled failures use `{ success: false, ... }`. Let controller failures reach the centralized `errorHandler` rather than duplicating response mapping.
- Keep browser-facing API configuration in `NEXT_PUBLIC_API_URL` only for the public base URL. Keep MongoDB credentials in backend `MONGODB_URI`; never move secrets into `NEXT_PUBLIC_*` variables.
- The public API is unauthenticated. CORS only controls browser origins and must not be treated as authorization.
- When changing the form payload shape, bump the `useFormPersist` storage key suffix and consider old session data invalid. Restored state receives only a top-level shape check; the backend still performs full validation on submission.
- Follow the generated Next.js guidance in [frontend/AGENTS.md](../frontend/AGENTS.md): for Next.js changes, consult the relevant documentation under `frontend/node_modules/next/dist/docs/` and account for the installed Next.js version's breaking changes.

See [README.md](../README.md) for environment setup, API details, and Vercel deployment configuration.
