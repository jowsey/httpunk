import { wsServer } from './websocket';

class GameServer {
	public WsServer = wsServer;

	constructor() {
		// todo: simulate all time from world's saved time to current time (instantly progress actions that take time, etc)
	}
}

export { GameServer };
