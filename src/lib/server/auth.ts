import { betterAuth } from 'better-auth';
import { oneTimeToken } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';

export const auth = betterAuth({
	// todo come back to this when better-auth get their shit together
	// https://www.better-auth.com/docs/integrations/svelte-kit#server-action-cookies
	// plugins: [sveltekitCookies(getRequestEvent), oneTimeToken()], 
	plugins: [oneTimeToken()],
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!
		}
	}
});

export type Session = typeof auth.$Infer.Session;
