import { drizzle } from 'drizzle-orm/bun-sql';
import * as schema from './schema/';

if (!process.env.POSTGRES_URL) throw new Error('POSTGRES_URL is not set');

export const db = drizzle(process.env.POSTGRES_URL, { schema });
export * as schema from './schema';
