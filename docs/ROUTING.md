# routing conventions

- **canonical surface:** [`src/routes/`](../src/routes/). tanstack start file-based routing only; there is no parallel `app/` router.
- **default shape:** one route file owns `Route` (from `createFileRoute`), `head`, the page component, and route-local metadata (e.g. `*Meta` exports for listings).
- **folders:** use a directory + `route.tsx` (or `index.tsx` for section roots) when the route has colocated assets or would be unwieldy as a single top-level file.
- **`-` prefix:** files and folders starting with `-` are ignored by the route generator; use them for assets or rare sidecars next to a route.
- **escape hatch:** split out a sibling module only when execution boundaries or file size make a single file worse — not as a default.

see [tanstack start — routing](https://tanstack.com/start/latest/docs/framework/react/guide/routing) and [file-based routing api](https://tanstack.com/router/latest/docs/api/file-based-routing).

## path aliases

- `@/components/*`, `@/ui/*`, `@/lib/*` — repo-root `components` / `lib`
- `@/providers/*` — `src/providers/*` (see `tsconfig.json` / `tsconfig.start.json`)
- `~/` — `src/*` (tanstack / start examples)

`src/routes/__root.tsx` imports shell components with relative paths (`../components/...`) so the bundler resolves them the same way as other route modules.
