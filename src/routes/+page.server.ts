import { characterNameRegex } from '$lib';
import { auth } from '$lib/server/auth';
import { db, schema } from '$lib/server/db';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	// Create a new character
	createCharacter: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		if (typeof name !== 'string' || name.trim() === '' || name.length > 12 || !characterNameRegex.test(name)) {
			// should be unreachable provided frontend validates properly
			console.warn(`User somehow submitted ${name}`);
			return fail(400, { name, nameErr: 'Invalid character name.' });
		}

		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			// maybe if session expired since page load
			console.warn('Unauthed attempt to create character');
			console.dir({ headers: request.headers });

			return redirect(303, '/');
		}

		const existingCharacter = await db
			.select()
			.from(schema.character)
			.where(eq(schema.character.userId, session.user.id));

		if (existingCharacter.length) {
			// maybe if user has multiple tabs open
			console.warn(`User ${session.user.name} already has a character!`);
			console.dir({ existingCharacter });
			return redirect(303, '/character');
		}

		console.log(`Creating character with name ${name}`);

		const newCharacter = await db
			.insert(schema.character)
			.values({
				userId: session.user.id,
				name
			})
			.returning();

		console.dir({ newCharacter });
		return redirect(303, '/character');
	}
} satisfies Actions;
