import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect } from '@sveltejs/kit';
import { db, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.session = session;

	if (event.route.id === '/' && session) {
		throw redirect(303, '/home');
	}

	if (event.route.id?.includes('(game)')) {
		if (!session) {
			throw redirect(303, '/');
		}

		const characters = await db.select().from(schema.character).where(eq(schema.character.userId, session.user.id));

		console.dir({ characters, pathname: event.url.pathname });

		if (event.url.pathname !== '/character' && !characters.length) {
			console.log('no characters found');
			throw redirect(303, '/character');
		}

		if (characters.length > 1) {
			console.warn(`User ${session.user.id} has ${characters.length} characters (?)`);
		}

		event.locals.character = characters[0];
	}

	const response = svelteKitHandler({ event, resolve, auth });
	return response;
}
