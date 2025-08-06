export interface WebsocketMessage {
	type: string;
}

export interface CharacterExpUpdateMessage extends WebsocketMessage {
	type: 'characterExpUpdate';
	characterId: number;
	exp: number;
}

export interface CharacterLevelUpdateMessage extends WebsocketMessage {
	type: 'characterLevelUpdate';
	characterId: number;
	level: number;
}
