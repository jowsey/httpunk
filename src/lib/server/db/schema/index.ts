import { pgTable, text, integer, timestamp, pgEnum, uuid, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './better-auth';
import { relations, sql } from 'drizzle-orm';
export * from './better-auth';

export const gearRarityEnum = pgEnum('gear_rarity', ['none', '+', '++']);
export const pronounsEnum = pgEnum('pronouns', ['he', 'they', 'she']);
export const equipmentTypesEnum = pgEnum('equipment_type', ['weapon', 'apparel']);
export const bodySlotsEnum = pgEnum('body_slots', ['head', 'chest', 'arms', 'hands', 'legs', 'feet']);
export const bodyLayerEnum = pgEnum('body_layer', ['clothing_inner', 'clothing_outer', 'armor']);

export const itemInstance = pgTable('item_instance', {
	id: uuid('id').primaryKey().defaultRandom(),
	defKey: text('registry_id').notNull(),
	tier: integer('tier').notNull().default(1),
	rarity: gearRarityEnum('rarity').notNull().default('none')
});

export const itemRelations = relations(itemInstance, ({ one }) => ({
	inInventory: one(inventoryItem),
	equip: one(equippedItem)
}));

// maybe one day Drizzle will support https://www.postgresql.org/docs/current/tutorial-inheritance.html </3
const combatCharacterShared = {
	name: text('name').notNull(),
	exp: integer('exp').notNull().default(0),
	level: integer('level').notNull().default(1)
};

export const character = pgTable('character', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	...combatCharacterShared,
	pronouns: pronounsEnum('pronouns').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const characterRelations = relations(character, ({ one, many }) => ({
	user: one(user, { fields: [character.userId], references: [user.id] }),
	equipment: many(equippedItem),
	inventoryItems: many(inventoryItem)
}));

export const mercenary = pgTable('mercenary', {
	id: uuid('id').primaryKey().defaultRandom(),
	characterId: uuid('character_id')
		.notNull()
		.references(() => character.id, { onDelete: 'cascade' }),
	...combatCharacterShared
});

export const mercenaryRelations = relations(mercenary, ({ one, many }) => ({
	character: one(character, { fields: [mercenary.characterId], references: [character.id] }),
	equipment: many(equippedItem)
}));

export const inventoryItem = pgTable('inventory_item', {
	id: uuid('id').primaryKey().defaultRandom(),
	characterId: uuid('character_id')
		.notNull()
		.references(() => character.id, { onDelete: 'cascade' }),
	itemId: uuid('item_id')
		.notNull()
		.references(() => itemInstance.id, { onDelete: 'cascade' }),
	quantity: integer('quantity').notNull().default(1)
});

export const inventoryItemsRelations = relations(inventoryItem, ({ one }) => ({
	character: one(character, { fields: [inventoryItem.characterId], references: [character.id] }),
	item: one(itemInstance, { fields: [inventoryItem.itemId], references: [itemInstance.id] })
}));

export const equippedItem = pgTable(
	'equipped_item',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		characterId: uuid('character_id').references(() => character.id, { onDelete: 'cascade' }),
		mercenaryId: uuid('mercenary_id').references(() => mercenary.id, { onDelete: 'cascade' }),
		itemId: uuid('item_id')
			.notNull()
			.references(() => itemInstance.id, { onDelete: 'cascade' }),
		type: equipmentTypesEnum('type').notNull(),
		slot: bodySlotsEnum('slot'), // null if weapon
		layer: bodyLayerEnum('layer') // ^
	},
	(table) => [
		// Ensure only one ID is set (character or mercenary)
		check(
			'equipped_item_only_one_owner',
			sql`(${table.characterId} IS NOT NULL) != (${table.mercenaryId} IS NOT NULL)`
		),
		// Ensure slot and layer are either both null or both not null
		check('equipped_item_slot_layer_together', sql`(${table.slot} IS NULL) = (${table.layer} IS NULL)`),
		// Ensure only one piece of apparel per slot and layer
		uniqueIndex('equipped_item_character_slot_layer_idx')
			.on(table.characterId, table.slot, table.layer)
			.where(sql`${table.characterId} IS NOT NULL AND ${table.type} = 'apparel'`),
		// ^, mercenary
		uniqueIndex('equipped_item_mercenary_slot_layer_idx')
			.on(table.mercenaryId, table.slot, table.layer)
			.where(sql`${table.mercenaryId} IS NOT NULL AND ${table.type} = 'apparel'`),
		// Ensure only one weapon is equipped
		uniqueIndex('equipped_item_character_weapon_idx')
			.on(table.characterId, table.type)
			.where(sql`${table.characterId} IS NOT NULL AND ${table.type} = 'weapon'`),
		// ^, mercenary
		uniqueIndex('equipped_item_mercenary_weapon_idx')
			.on(table.mercenaryId, table.type)
			.where(sql`${table.mercenaryId} IS NOT NULL AND ${table.type} = 'weapon'`)
	]
);

export const equippedItemRelations = relations(equippedItem, ({ one }) => ({
	character: one(character, { fields: [equippedItem.characterId], references: [character.id] }),
	mercenary: one(mercenary, { fields: [equippedItem.mercenaryId], references: [mercenary.id] }),
	item: one(itemInstance, { fields: [equippedItem.itemId], references: [itemInstance.id] })
}));
