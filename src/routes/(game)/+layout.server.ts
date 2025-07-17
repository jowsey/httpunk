import { auth } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	if (!locals.session) {
		// *unreachable* - this route is protected by the handle hook
		throw new Error('Session not found in (game) layout load');
	}

	const { token } = await auth.api.generateOneTimeToken({
		headers: request.headers
	});

	return {
		websocketToken: token
	};
};
