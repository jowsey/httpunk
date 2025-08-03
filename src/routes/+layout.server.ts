import type { LayoutServerLoad } from './$types';
import { eq } from 'drizzle-orm';
import { db, schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export const load: LayoutServerLoad = async ({ request, locals, url }) => {
	if (!locals.session) {
		return;
	}

	const characters = await db
		.select()
		.from(schema.character)
		.where(eq(schema.character.userId, locals.session.user.id));

	console.dir({ characters, pathname: url.pathname });

	if (url.pathname !== '/' && !characters.length) {
		throw redirect(303, '/');
	}

	if (characters.length > 1) {
		console.warn(`User ${locals.session.user.id} has ${characters.length} characters (?)`);
	}

	const { token: wsToken } = await auth.api.generateOneTimeToken({
		headers: request.headers
	});

	return {
		session: locals.session,
		character: characters.length ? characters[0] : undefined,
		wsToken
	};
};
