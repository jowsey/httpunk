import type { ApparelDef } from '../defs';

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
