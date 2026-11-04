# Project X v1

John's original MVP: a React/Vite events page and a minimal Express API with no observability.

```bash
cd v1-vite
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/events
- Default simulated latency: 13 ms per query, or roughly two seconds for 151 queries

Override the delay when needed:

```bash
SIMULATED_DB_LATENCY_MS=0 npm run dev
```

If port 5173 is occupied, choose another frontend port while keeping the API on 3001:

```bash
VITE_PORT=5174 npm run dev
```
