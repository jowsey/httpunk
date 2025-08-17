import type { JobDef, ItemDef } from './types';
import * as weapons from './items/weapons';
import * as apparel from './items/apparel';
import * as jobs from './jobs/index';

class Registry {
	private items: Map<string, ItemDef> = new Map();
	private jobs: Map<string, JobDef> = new Map();

	constructor() {
		const weaponsList = Object.values(weapons);
		const apparelList = Object.values(apparel);
		const jobsList = Object.values(jobs);

		const allIds = new Set<string>();
		for (const item of [...weaponsList, ...apparelList, ...jobsList]) {
			if (allIds.has(item.id)) {
				throw new Error(`Duplicate registry ID found: ${item.id}`);
			}

			allIds.add(item.id);
		}

		console.log('Registered:');

		for (const weapon of weaponsList) {
			this.items.set(weapon.id, weapon);
		}

		console.log(`- ${weaponsList.length}x\t weapons`);

		for (const item of apparelList) {
			this.items.set(item.id, item);
		}

		console.log(`- ${apparelList.length}x\t apparel`);

		for (const job of jobsList) {
			this.jobs.set(job.id, job);
		}

		console.log(`- ${jobsList.length}x\t jobs`);
	}
}

export const registry = new Registry();
