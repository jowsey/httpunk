import {
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
} from "$env/static/private";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID as string,
			clientSecret: DISCORD_CLIENT_SECRET as string,
		},
	},
});
