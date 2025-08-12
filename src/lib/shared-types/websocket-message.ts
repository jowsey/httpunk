import type { schema } from '$lib/server/db';

export const WebsocketMessageType = {
	CHARACTER_EXP_UPDATE: 0,
	CHARACTER_LEVEL_UPDATE: 1
} as const;

export interface WebsocketMessage {
	type: (typeof WebsocketMessageType)[keyof typeof WebsocketMessageType];
}

interface CharacterMessage extends WebsocketMessage {
	characterId: typeof schema.character.$inferSelect.id;
}

export interface CharacterExpUpdateMessage extends CharacterMessage {
	type: typeof WebsocketMessageType.CHARACTER_EXP_UPDATE;
	exp: number;
}

export interface CharacterLevelUpdateMessage extends CharacterMessage {
	type: typeof WebsocketMessageType.CHARACTER_LEVEL_UPDATE;
	level: number;
}
