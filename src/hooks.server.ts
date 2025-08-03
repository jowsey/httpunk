import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	event.locals.session = session;

	if (event.route.id?.includes('(authed') && !session) {
		console.warn(`Unauthed access to ${event.route.id}`);
		throw redirect(303, '/');
	}

	const response = svelteKitHandler({ event, resolve, auth, building });
	return response;
}
