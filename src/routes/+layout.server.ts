import type { LayoutServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db, schema } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	if (!locals.session) {
		return;
	}

	depends('app:session'); // invalidated in (game)/profile/+page.svelte on sign out

	const characters = await db
		.select()
		.from(schema.character)
		.where(eq(schema.character.userId, locals.session!.user.id));

	return {
		session: locals.session,
		character: characters.at(0)
	};
};
