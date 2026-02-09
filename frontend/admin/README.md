# Choppa Admin

Admin dashboard for Chopify (Choppa).

## Setup

1. Copy `.env.local.example` to `.env.local` and set `VITE_API_URL` if needed.
2. Install dependencies:

```bash
cd frontend/admin
npm install
```

3. Run dev server:

```bash
npm run dev
```

The dev server defaults to `http://localhost:5173`.

## Notes
- The admin uses Vite + React + Tailwind.
- API requests use `VITE_API_URL` from the environment.
