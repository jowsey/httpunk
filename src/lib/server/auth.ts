import {
	DATABASE_URL,
	DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET,
} from "$env/static/private";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database(DATABASE_URL);

export const auth = betterAuth({
	database: db,
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID as string,
			clientSecret: DISCORD_CLIENT_SECRET as string,
		},
	},
});
