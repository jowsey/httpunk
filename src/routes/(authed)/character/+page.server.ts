import type { Actions } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const actions = {
	// Delete all of a user's characters
	deleteCharacters: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			console.warn('Unauthed attempt to delete characters');
			console.dir({ headers: request.headers });
			return redirect(303, '/');
		}

		const characters = await db.select().from(schema.character).where(eq(schema.character.userId, session.user.id));

		if (!characters) {
			console.warn(`User ${session.user.name} attempted to delete non-existent characters`);
			console.dir({ existingCharacter: characters });
			return redirect(303, '/character');
		}

		console.log(`Deleting ${characters.length} character(s) of user ${session.user.name}`);

		for (const char of characters) {
			await db.delete(schema.character).where(eq(schema.character.id, char.id));
		}

		return;
	}
} satisfies Actions;
