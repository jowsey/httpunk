import { auth } from '$lib/server/auth';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request, url }) => {
	if (!locals.session) {
		// *unreachable* - this route is protected by the handle hook
		throw new Error('Session not found in (game) layout load');
	}

	const { token } = await auth.api.generateOneTimeToken({
		headers: request.headers
	});

	const characters = await db
		.select()
		.from(schema.character)
		.where(eq(schema.character.userId, locals.session.user.id));

	console.dir({ characters, pathname: url.pathname });

	if (url.pathname !== '/character' && !characters.length) {
		console.log('(game): no characters found, redirecting to character creation');
		throw redirect(303, '/character');
	}

	if (characters.length > 1) {
		console.warn(`User ${locals.session.user.id} has ${characters.length} characters (?)`);
	}

	return {
		websocketToken: token,
		character: characters[0]
	};
};
