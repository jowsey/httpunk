# httpunk

A Cyberpunk-themed web-game built on SvelteKit & Bun.

## Setup

Install dependencies:

```sh
bun install
```

Populate `.env` based on the `.env.example`

## Database

Generate Better Auth's schema files:

```sh
bun run better-auth:generate
```

Push & migrate schema changes to httpunk.db:

```sh
bun run db:push
```

## Running

### dev

Run Vite's dev server & watch the WS backend in parallel:

```sh
bun run dev
```

### production

Build SvelteKit's Node server:

```sh
bun run build
```

Run the Node server & WS backend in parallel:

```sh
bun run prod
```
