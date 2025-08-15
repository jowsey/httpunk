import type { ApparelDef } from '../types';

export const shirt: ApparelDef = {
	id: 'item.apparel.shirt',
	name: 'Shirt',
	description: 'A basic shirt.',
	type: 'apparel',
	layer: 'clothing_inner',
	covers: {
		chest: 5
	}
};
