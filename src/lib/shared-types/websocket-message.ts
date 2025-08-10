import type { schema } from '$lib/server/db';

export interface WebsocketMessage {
	type: string;
}

interface CharacterMessage extends WebsocketMessage {
	characterId: typeof schema.character.$inferSelect.id;
}

export interface CharacterExpUpdateMessage extends CharacterMessage {
	type: 'characterExpUpdate';
	exp: number;
}

export interface CharacterLevelUpdateMessage extends CharacterMessage {
	type: 'characterLevelUpdate';
	level: number;
}
