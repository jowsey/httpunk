import { betterAuth, type BetterAuthPlugin } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db } from './db';
import chalk from 'chalk';

const plugins: BetterAuthPlugin[] = [];

try {
	// if we're in sveltekit, use the sveltekit plugin, otherwise it's fine
	// todo this might not scale nicely if we need more plugins
	const { getRequestEvent } = await import('$app/server');
	plugins.push(sveltekitCookies(getRequestEvent));
	console.log(chalk.green(`Using sveltekitCookies() Better-Auth plugin. This is expected in vite & web.`));
} catch {
	// todo find a way to figure out if we're in core and either silent or error
	console.log(chalk.blue(`Skipping sveltekitCookies() Better-Auth plugin. This is expected in core.`));
}

export const auth = betterAuth({
	plugins,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!
		}
	}
});

export type Session = typeof auth.$Infer.Session;
