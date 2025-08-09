<img alt="httpunk favicon" width="38" src="static/favicon.png" align="right" />

# httpunk

A Cyberpunk-themed web-game.

## Setup

1. Ensure you have [Bun](https://bun.sh) and [Docker](https://www.docker.com/) installed

2. Install dependencies

```sh
bun install
```

3. Populate a `.env` based on the provided `.env.example`

4. In your Discord application, add an OAuth2 redirect pointing to `<deployment_url>/api/auth/callback/discord`

5. Push the initial database schema to `httpunk.db`

```sh
bun run db:push
```

## Development

Run the Vite dev server, core backend (--watch), and Valkey container in parallel:

```sh
bun run dev
```

### Database

Generate Better Auth's schema files:

```sh
bun run better-auth:generate
```

Push & migrate schema changes to httpunk.db:

```sh
bun run db:push
```

## Deployment

Build SvelteKit's Node server:

```sh
bun run build
```

Run the Node server, core backend, and Valkey container in parallel:

```sh
bun run prod
```
