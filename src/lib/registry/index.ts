import type { ItemDef } from './types';
import * as weapons from './items/weapons';
import * as apparel from './items/apparel';

class Registry {
	private items: Map<string, ItemDef> = new Map();

	constructor() {
		for (const weapon of Object.values(weapons)) {
			this.registerItem(weapon);
		}

		for (const item of Object.values(apparel)) {
			this.registerItem(item);
		}

		console.log(`Registered ${Object.keys(weapons).length}x weapons, ${Object.keys(apparel).length}x apparel`);
	}

	registerItem(item: ItemDef) {
		if (this.items.has(item.id)) {
			throw new Error(`Item with id ${item.id} already exists in the registry!`);
		}

		this.items.set(item.id, item);
	}

	getItem(id: string): ItemDef | undefined {
		return this.items.get(id);
	}
}

export const registry = new Registry();
