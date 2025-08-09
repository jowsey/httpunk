<div align="center">
<img alt="httpunk favicon" src=".github/httpunk-banner.png" align="center" />
<br />

<h1>httpunk</h1>
<p>A Cyberpunk-themed web-game.</p>
</div>

## Setup

1. Ensure you have [Bun](https://bun.sh) and [Docker](https://www.docker.com/) installed

2. Install dependencies

```console
bun install
```

3. Populate a `.env` based on the provided `.env.example`

4. In your Discord application, add an OAuth2 redirect pointing to `<deployment_url>/api/auth/callback/discord`

5. Push the initial database schema to `httpunk.db`

```console
bun run db:push
```

## Development

Run the Vite dev server, core backend (--watch), and Valkey container in parallel:

```console
bun run dev
```

### Database

Generate Better Auth's schema files:

```console
bun run better-auth:generate
```

Push & migrate schema changes to httpunk.db:

```console
bun run db:push
```

## Deployment

Build SvelteKit's Node server:

```console
bun run build
```

Run the Node server, core backend, and Valkey container in parallel:

```console
bun run prod
```
