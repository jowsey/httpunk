import type { ItemDef } from './defs';
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
	}

	registerItem(item: ItemDef) {
		if (this.items.has(item.id)) {
			throw new Error(`Item with id ${item.id} already exists in the registry!`);
		}

		this.items.set(item.id, item);
		console.log(`Registered item: ${item.id}`);
	}

	getItem(id: string): ItemDef | undefined {
		return this.items.get(id);
	}
}

export const registry = new Registry();
