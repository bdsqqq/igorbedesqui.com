# igorbedesqui.com

personal site built with [tanstack start](https://tanstack.com/start/latest) (vite, react 19, tailwind v4).

## scripts

```bash
pnpm dev      # vite dev server (port 3000)
pnpm build    # production build + tsc
pnpm preview  # preview production client
pnpm start    # node .output/server/index.mjs
pnpm lint     # oxlint
pnpm fmt      # oxfmt
```

## routing

routes live under `src/routes/`. see [docs/ROUTING.md](docs/ROUTING.md) for conventions.

## requirements

- node 24.x (see `package.json` engines)
- pnpm 10
