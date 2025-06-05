import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = new Database(env.DATABASE_URL);
client.exec("PRAGMA journal_mode = WAL;");

export const db = drizzle(client, { schema });
