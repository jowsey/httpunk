import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// redirect back to landing if not authed
	if (!parentData?.session) {
		throw redirect(302, '/');
	}

	return {};
};
