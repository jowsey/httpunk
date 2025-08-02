import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.session = session;

	if (event.route.id === '/' && session) {
		throw redirect(303, '/home');
	}

	if (event.route.id?.includes('(game)') && !session) {
		throw redirect(303, '/');
	}

	const response = svelteKitHandler({ event, resolve, auth, building });
	return response;
}
