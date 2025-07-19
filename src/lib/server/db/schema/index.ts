import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { user } from './better-auth';
export * from './better-auth';

export const character = sqliteTable('character', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull()
});
