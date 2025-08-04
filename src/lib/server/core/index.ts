// runs persistent websocket server
import './websocket';

import { db, schema } from '../db';
import { GameServer } from './GameServer';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const displayTimezone = process.env.DISPLAY_TIMEZONE;
if (!displayTimezone) {
	throw new Error('.env DISPLAY_TIMEZONE is not set');
}

let worldState = await db.query.worldState.findFirst();

if (!worldState) {
	const startingYear = parseInt(process.env.STARTING_YEAR ?? '');
	if (isNaN(startingYear)) {
		throw new Error('.env STARTING_YEAR is invalid');
	}

	worldState = (
		await db
			.insert(schema.worldState)
			.values({
				time: dayjs().year(startingYear).valueOf()
			})
			.returning()
	)[0];
}

const worldTime = dayjs(worldState.time).tz(displayTimezone);
console.log(`World time is ${worldTime.format()}`);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gameServer = new GameServer(worldTime);
