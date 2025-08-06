import type { Actions } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { ApplyExp } from '$lib/server/utils/character';

export const actions = {
	// Give a character X exp (temp, debug)
	giveExp: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			console.warn('Unauthed attempt to give exp');
			throw redirect(303, '/');
		}

		const formData = await request.formData();
		const characterId = parseInt(formData.get('characterId') as string);
		const exp = parseInt(formData.get('exp') as string);

		// make sure character belongs to user
		const characters = await db
			.select()
			.from(schema.character)
			.where(and(eq(schema.character.id, characterId), eq(schema.character.userId, session.user.id)));

		if (!characters.length) {
			// not too bothered about the UX of this, more for testing
			console.warn(`Character ${characterId} not found or does not belong to user ${session.user.id}`);
			throw redirect(303, '/');
		}

		await ApplyExp(characterId, exp);
		return;
	},
	// Delete all of a user's characters
	deleteCharacters: async ({ request }) => {
		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			console.warn('Unauthed attempt to delete characters');
			console.dir({ headers: request.headers });
			throw redirect(303, '/');
		}

		const characters = await db.select().from(schema.character).where(eq(schema.character.userId, session.user.id));

		if (!characters.length) {
			console.warn(`User ${session.user.name} doesn't have any characters to delete`);
			console.dir({ existingCharacter: characters });
			throw redirect(303, '/character');
		}

		console.log(`Deleting ${characters.length} character(s) of user ${session.user.name}`);

		for (const char of characters) {
			await db.delete(schema.character).where(eq(schema.character.id, char.id));
		}

		return;
	}
} satisfies Actions;
