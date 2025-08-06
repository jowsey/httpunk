import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './better-auth';
export * from './better-auth';

export const worldState = sqliteTable('world_state', {
	updatedAt: integer('updated_at').notNull()
});

export const character = sqliteTable(
	'character',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		pronouns: text('pronouns', { enum: ['he', 'they', 'she'] }).notNull(),
		level: integer('level').notNull().default(1),
		exp: integer('exp').notNull().default(0),
		createdAt: integer('created_at')
			.notNull()
			.$defaultFn(() => Date.now())
	}
	// (table) => [check('pronouns_check1', sql`${table.pronouns} IN ('he', 'they', 'she')`)] // db:push sorta breaks with any of these checks rn, todo fix
);
