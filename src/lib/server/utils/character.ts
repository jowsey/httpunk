import { eq } from 'drizzle-orm';
import { db, schema } from '../db';
import { redisPublisher } from '../redis';
import { type CharacterExpUpdateEvent, type CharacterLevelUpdateEvent } from '../types/redis-event';
import { EXP_GOAL_FOR_LEVEL } from '$lib/constants';

/**
 * Apply experience points to a character.
 * @param characterId The ID of the character to apply experience to.
 * @param exp The amount of experience to apply.
 * @returns The new level and experience of the character.
 */
export const ApplyExp = async (characterId: typeof schema.character.$inferSelect.id, exp: number) => {
	const characters = await db.select().from(schema.character).where(eq(schema.character.id, characterId)).limit(1);
	const character = characters.at(0);
	if (!character) {
		throw new Error(`Character with ID ${characterId} not found`);
	}

	// Loop through levels until there's not enough exp to level up again
	let currentExp = character.exp + exp;
	let currentLevel = character.level;

	let levelUpsPerformed = 0;

	while (currentExp >= EXP_GOAL_FOR_LEVEL(currentLevel)) {
		currentExp -= EXP_GOAL_FOR_LEVEL(currentLevel);
		currentLevel++;
		levelUpsPerformed++;
	}

	await db
		.update(schema.character)
		.set({
			exp: currentExp,
			level: currentLevel
		})
		.where(eq(schema.character.id, characterId));

	// Publish updates to Redis
	if (exp !== 0) {
		await redisPublisher.publish(
			'character:exp:update',
			JSON.stringify({
				characterId: character.id,
				exp: currentExp
			} as CharacterExpUpdateEvent)
		);
	}

	for (let i = 0; i < levelUpsPerformed; i++) {
		await redisPublisher.publish(
			'character:level:update',
			JSON.stringify({
				characterId: character.id,
				level: currentLevel - levelUpsPerformed + i + 1
			} as CharacterLevelUpdateEvent)
		);
	}

	return { newLevel: currentLevel, newExp: currentExp };
};
