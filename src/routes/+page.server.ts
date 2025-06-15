import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// redirect to game home if already authed
	if (parentData?.session) {
		throw redirect(302, '/home');
	}

	return {};
};
