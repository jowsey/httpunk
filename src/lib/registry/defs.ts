import type { bodyLayerEnum, bodySlotsEnum } from '$lib/server/db/schema';

export interface ItemDef {
	id: string;
	name: string;
	description: string;
	type: 'weapon' | 'apparel' | 'consumable' | 'misc';
}

export interface WeaponDef extends ItemDef {
	type: 'weapon';
	weaponType: 'pistol' | 'assault_rifle' | 'smg' | 'sniper' | 'shotgun' | 'melee';
}

export interface ApparelDef extends ItemDef {
	type: 'apparel';
	layer: (typeof bodyLayerEnum.enumValues)[number];
	covers: {
		[slot in (typeof bodySlotsEnum.enumValues)[number]]?: number;
	};
}
