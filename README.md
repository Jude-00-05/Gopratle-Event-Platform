# GoPratle Event Platform

GoPratle is a full-stack event requirement app built for the GoPratle Full-Stack Developer Intern assignment. Customers describe an event in a four-step form, select a planner, performer, or crew, review the brief, and submit it to the API. Requirements are validated with Zod and stored in MongoDB Atlas through Mongoose.

## Deployed application

- Frontend: <https://gopratle-event-platform.vercel.app>
- Backend API: <https://gopratle-event-api.vercel.app>
- Repository: <https://github.com/Jude-00-05/Gopratle-Event-Platform>
- Database: MongoDB Atlas

## Stack

- Frontend: Next.js 16 App Router, React 19, TypeScript, React Hook Form, Zod, CSS Modules, and Lucide icons.
- Backend: Node.js, Express 4, TypeScript, Zod, Helmet, and the CORS middleware.
- Persistence: MongoDB Atlas with Mongoose.
- Hosting: separate Vercel projects for the frontend and backend.

## Repository layout

```text
.
├── README.md
├── package.json                 # Root development and build shortcuts
├── frontend/
│   ├── .env.local.example
│   ├── package.json
│   └── src/
│       ├── app/                  # /, /requirements, /requirements/new
│       ├── components/           # Layout, form steps, and UI controls
│       ├── hooks/                # Multi-step state and sessionStorage persistence
│       ├── lib/                  # API client and formatting helpers
│       └── schemas/              # Client-side Zod schemas
└── backend/
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app.ts                # Express app, middleware, and Vercel export
        ├── server.ts             # Local HTTP server entrypoint
        ├── config/db.ts          # Mongoose connection
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        └── schemas/              # Server-side Zod validation
```

## Requirements flow

1. **Basics:** event name and type, dates, location, optional venue, and service category.
2. **Requirements:** category-specific attendance, role, services, equipment, quantity, duration, and INR budget fields.
3. **Preferences:** category-specific logistics and optional notes.
4. **Review:** inspect or edit the brief, then submit it.

The form stores its in-progress state in the current tab's `sessionStorage`, clears dependent category details after a confirmed category switch, and clears saved state after successful submission or reset. Client and server schemas validate submissions independently. Budgets are sent as numbers in INR.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

Clone the repository and install each application's locked dependencies:

```bash
git clone https://github.com/Jude-00-05/Gopratle-Event-Platform.git
cd Gopratle-Event-Platform
npm ci --prefix backend
npm ci --prefix frontend
```

Create local environment files from the committed examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

On PowerShell, use `Copy-Item` with the same source and destination paths. Set `MONGODB_URI` in `backend/.env` to a MongoDB Atlas URI available to your local machine. Do not commit the real URI. The frontend example points to the local backend at `http://localhost:4000`.

Start the apps in separate terminals from the repository root:

```bash
npm run dev:backend
npm run dev:frontend
```

The frontend runs at <http://localhost:3000>; the local backend listens on port `4000` by default. The backend loads `backend/.env` through `dotenv`. It requires `MONGODB_URI`; `PORT` controls the local listener, while `FRONTEND_URL` adds an allowed CORS origin. Vercel invokes the exported app directly, so it does not use the local `PORT` listener.

## Scripts and checks

Root shortcuts:

```bash
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run build:backend
```

Equivalent app-level build commands are `npm --prefix frontend run build` and `npm --prefix backend run build`. The frontend also provides `npm --prefix frontend run lint`. There is no test script or CI workflow in this repository.

## API

The frontend API client reads `NEXT_PUBLIC_API_URL` as the API **base URL**, then constructs `/api/requirements` as an absolute URL. Local development uses `http://localhost:4000`; production uses `https://gopratle-event-api.vercel.app`.

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/api/requirements` | Returns `200` with `{ "success": true, "data": [...] }`, newest first. |
| `POST` | `/api/requirements` | Validates the full category-specific payload. Returns `201` with `{ "success": true, "data": <saved document> }` only after MongoDB confirms the insert. Invalid payloads return `400` with `{ "success": false, "errors": ... }`. |
| `GET` | `/health` | Returns `200` with a status and timestamp; it does not test MongoDB connectivity. |

Mongoose validation failures return `400`; duplicate-key errors return `409`. Unexpected errors return a generic `500` response in production. Development responses may include an error detail.

The API's CORS middleware runs before the routes. It allows the deployed frontend origin `https://gopratle-event-platform.vercel.app`, local development at `http://localhost:3000`, and the optional `FRONTEND_URL` origin. CORS is a browser access policy, not authentication; the requirements API currently has no authentication middleware.

## Vercel deployment

The frontend and backend are separate Vercel projects connected to this repository.

### Backend project

1. Set **Root Directory** to `backend`.
2. Use Vercel's Express framework detection. The Vercel entrypoint is `src/app.ts`, which default-exports the Express app; `src/server.ts` remains the local listener entrypoint.
3. Leave **Output Directory** unset so Vercel deploys the Express function. Do not set it to `dist`; `dist` is the TypeScript build output, not a static site.
4. If setting the build command explicitly, use `npm run build` from the backend project root.
5. Configure `MONGODB_URI` in Vercel Production, Preview, and Development as appropriate. Add `NODE_ENV=production` if desired. No `PORT` setting is needed for the Vercel function.
6. Deploy the backend project. Its API base URL is <https://gopratle-event-api.vercel.app>.

There is no `vercel.json` in this repository; configure the Vercel project as described above so it deploys the Express function rather than treating `dist` as a static site.

### Frontend project

1. Set **Root Directory** to `frontend` and use the Next.js framework preset.
2. Set `NEXT_PUBLIC_API_URL` for the **Production** environment to exactly `https://gopratle-event-api.vercel.app` (no endpoint path and no trailing slash). For local development, use `http://localhost:4000` in `frontend/.env.local`.
3. Redeploy the frontend after changing this value. Next.js embeds `NEXT_PUBLIC_*` values into the browser bundle at build time.

Do not put secrets in `NEXT_PUBLIC_*` variables. Keep the Atlas URI in the backend's private `MONGODB_URI` environment variable.

## Security and data notes

- Real `.env` and `.env.local` files are ignored by Git. Only environment templates belong in the repository.
- The API validates JSON size and payload shape, uses Helmet, and restricts browser origins through CORS. The routes are unauthenticated, so do not treat CORS as protection from direct API clients or submit sensitive personal data.
- No API rate limiting or automated test suite is configured. The submit button disables while a request is pending, but the API has no idempotency key; retrying after an ambiguous network failure can create a duplicate. Restored session data receives a top-level shape check, not full client-schema validation; the server validates every submitted payload. Follow-up improvements include focused form/API tests, idempotent submission, validating restored state, and evaluating authentication and rate limiting if the product needs private requirements or abuse protection.
- A current-tree secret scan cannot establish whether credentials were ever committed in earlier Git history. Rotate any credential found in repository history and review that history separately.
