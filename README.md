<img alt="httpunk favicon" width="38" src="static/favicon.png" align="right" />

# httpunk

A Cyberpunk-themed web-game.

## Developing

### Setup

Ensure you have [Bun](https://bun.sh) and Docker installed.

Install dependencies:

```sh
bun install
```

Populate `.env` based on the `.env.example`

### Database

Generate Better Auth's schema files:

```sh
bun run better-auth:generate
```

Push & migrate schema changes to httpunk.db:

```sh
bun run db:push
```

### Running

#### dev

Run the Vite dev server, core backend (--watch), and Valkey container in parallel:

```sh
bun run dev
```

#### production

Build SvelteKit's Node server:

```sh
bun run build
```

Run the Node server, core backend, and Valkey container in parallel:

```sh
bun run prod
```
