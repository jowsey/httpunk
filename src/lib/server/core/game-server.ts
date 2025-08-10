import { registry } from '../../registry';
import { wsServer } from './websocket';

class GameServer {
	public WsServer = wsServer;
	public Registry = registry;

	constructor() {
		// todo: simulate all time from world's saved time to current time (instantly progress actions that take time, etc)
	}
}

export { GameServer };
