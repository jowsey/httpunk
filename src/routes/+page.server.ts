import { CHARACTER_NAME_REGEX, MAX_CHARACTER_NAME_LENGTH } from '$lib/constants';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { character } = await parent();
	if (character) {
		throw redirect(303, '/hub');
	}
};

export const actions = {
	// Create a new character
	createCharacter: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		if (!name || name.length > MAX_CHARACTER_NAME_LENGTH || !CHARACTER_NAME_REGEX.test(name)) {
			// should be unreachable provided frontend validates properly
			console.warn(`User somehow submitted ${name}`);
			return fail(400, { name, nameErr: 'Invalid character name.' });
		}

		const pronouns = formData.get('pronouns')?.toString().trim().toLowerCase();
		if (!pronouns || (pronouns !== 'he' && pronouns !== 'they' && pronouns !== 'she')) {
			// should be unreachable provided frontend validates properly
			console.warn(`User somehow submitted invalid pronouns: ${pronouns}`);
			return fail(400, { pronouns, pronounsErr: 'Invalid pronouns.' });
		}

		const session = await auth.api.getSession({ headers: request.headers });

		if (!session) {
			// maybe if session expired since page load
			console.warn('Unauthed attempt to create character');
			console.dir({ headers: request.headers });

			throw redirect(303, '/');
		}

		const existingCharacter = await db
			.select()
			.from(schema.character)
			.where(eq(schema.character.userId, session.user.id));

		if (existingCharacter.length) {
			// maybe if user has multiple tabs open
			console.warn(`User ${session.user.name} already has a character!`);
			console.dir({ existingCharacter });
			throw redirect(303, '/character');
		}

		console.log(`Creating character with name ${name}`);

		const newCharacter = await db
			.insert(schema.character)
			.values({
				userId: session.user.id,
				name,
				pronouns
			})
			.returning();

		console.dir({ newCharacter });
		throw redirect(303, '/character');
	}
} satisfies Actions;
