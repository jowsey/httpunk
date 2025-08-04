import dayjs from 'dayjs';

class GameServer {
	public Time: dayjs.Dayjs;

	constructor(time: dayjs.Dayjs) {
		// todo: simulate all time from world's saved time to current time (instantly progress actions that take time, etc)
		this.Time = time;
	}
}

export { GameServer };
