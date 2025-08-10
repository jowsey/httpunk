import type { schema } from '../db';

export interface CharacterEvent {
	characterId: typeof schema.character.$inferSelect.id;
}

export interface CharacterExpUpdateEvent extends CharacterEvent {
	exp: number;
}

export interface CharacterLevelUpdateEvent extends CharacterEvent {
	level: number;
}
