import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { character } = await parent();
	if (!character) {
		throw redirect(303, '/');
	}
};
