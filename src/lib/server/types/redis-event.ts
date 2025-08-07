export interface CharacterEvent {
	characterId: number;
}

export interface CharacterExpUpdateEvent extends CharacterEvent {
	exp: number;
}

export interface CharacterLevelUpdateEvent extends CharacterEvent {
	level: number;
}
