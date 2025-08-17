import {
	type CharacterExpUpdateMessage,
	type CharacterLevelUpdateMessage,
	type WebsocketMessage,
	WebsocketMessageType
} from '$lib/shared-types/websocket-message';
import { appState } from './state.svelte';

class WebsocketClient {
	private ws: WebSocket;
	public readyState: WebSocket['readyState'] = $state(WebSocket.CLOSED);

	constructor(url: string) {
		this.ws = new WebSocket(url);

		this.ws.onopen = this.onopen;
		this.ws.onmessage = this.onmessage;
		this.ws.onerror = this.onerror;
		this.ws.onclose = this.onclose;
	}

	private onopen = () => {
		this.readyState = this.ws.readyState;
		console.log('[ws] connection opened');
	};

	private onmessage = (event: MessageEvent) => {
		console.log('[ws] message:', event.data);

		const msgData = JSON.parse(event.data) as WebsocketMessage;

		switch (msgData.type) {
			case WebsocketMessageType.CHARACTER_EXP_UPDATE: {
				const expUpdate = msgData as CharacterExpUpdateMessage;
				if (expUpdate.characterId === appState.character?.id) {
					appState.character.exp = expUpdate.exp;
				}
				break;
			}
			case WebsocketMessageType.CHARACTER_LEVEL_UPDATE: {
				const levelUpdate = msgData as CharacterLevelUpdateMessage;
				if (levelUpdate.characterId === appState.character?.id) {
					appState.character.level = levelUpdate.level;
				}
				break;
			}
			default: {
				console.warn(`[ws] unknown message type: ${msgData.type}`);
				break;
			}
		}
	};

	private onerror = (error: Event) => {
		this.readyState = this.ws.readyState;
		console.error('[ws] error:', error);
	};

	private onclose = () => {
		this.readyState = this.ws.readyState;
		console.log('[ws] connection closed');
	};

	public close = () => {
		console.log('[ws] closing connection');
		return this.ws.close();
	};
}

export { WebsocketClient };
