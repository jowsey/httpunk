import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import { db, schema } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ request, locals, depends }) => {
	if (!locals.session) {
		return;
	}

	depends('app:session'); // invalidated in (game)/profile/+page.svelte on sign out

	const tokenPromise = auth.api.generateOneTimeToken({
		headers: request.headers
	});

	const charactersPromise = db
		.select()
		.from(schema.character)
		.where(eq(schema.character.userId, locals.session!.user.id));

	const [{ token: wsToken }, characters] = await Promise.all([tokenPromise, charactersPromise]);

	return {
		session: locals.session,
		wsToken,
		character: characters.at(0)
	};
};
