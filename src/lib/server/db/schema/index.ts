import { pgTable, text, integer, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { user } from './better-auth';
export * from './better-auth';

export const pronounsEnum = pgEnum('pronouns', ['he', 'they', 'she']);

export const character = pgTable(
	'character',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		pronouns: pronounsEnum().notNull(),
		level: integer('level').notNull().default(1),
		exp: integer('exp').notNull().default(0),
		createdAt: timestamp('created_at').notNull().defaultNow()
	}
	// (table) => [check('pronouns_check1', sql`${table.pronouns} IN ('he', 'they', 'she')`)] // db:push sorta breaks with any of these checks rn, todo fix
);
