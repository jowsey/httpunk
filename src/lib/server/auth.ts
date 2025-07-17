import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { oneTimeToken } from 'better-auth/plugins';

export const auth = betterAuth({
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
