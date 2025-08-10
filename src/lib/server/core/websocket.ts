import type { CharacterExpUpdateEvent, CharacterLevelUpdateEvent } from '../types/redis-event';
import type { CharacterExpUpdateMessage, CharacterLevelUpdateMessage } from '$lib/shared-types/websocket-message';
import { ApplyExp } from '../utils/character';
import { redisSubscriber } from '../redis';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { auth } from '../auth';
import chalk from 'chalk';

interface WebSocketData {
	userId: string;
}

redisSubscriber.subscribe('character:exp:update', async (message) => {
	const data = JSON.parse(message) as CharacterExpUpdateEvent;
	const userId = (
		await db
			.select({ userId: schema.character.userId })
			.from(schema.character)
			.where(eq(schema.character.id, data.characterId))
	)[0].userId;

	const ws = wsUsers.get(userId);
	if (ws) {
		console.log(`Sending exp update to user ${ws.data.userId}`);
		ws.send(
			JSON.stringify({
				type: 'characterExpUpdate',
				characterId: data.characterId,
				exp: data.exp
			} as CharacterExpUpdateMessage)
		);
	} else {
		console.warn(`No WebSocket connection found for user ID ${userId}`);
	}
});

redisSubscriber.subscribe('character:level:update', async (message) => {
	const data = JSON.parse(message) as CharacterLevelUpdateEvent;
	const userId = (
		await db
			.select({ userId: schema.character.userId })
			.from(schema.character)
			.where(eq(schema.character.id, data.characterId))
	)[0].userId;

	const ws = wsUsers.get(userId);
	if (ws) {
		console.log(`Sending level update to user ${ws.data.userId}`);
		ws.send(
			JSON.stringify({
				type: 'characterLevelUpdate',
				characterId: data.characterId,
				level: data.level
			} as CharacterLevelUpdateMessage)
		);
	} else {
		console.warn(`No WebSocket connection found for user ID ${userId}`);
	}
});

const wsUsers = new Map<string, Bun.ServerWebSocket<WebSocketData>>();

const path = '/api/ws';
export const wsServer = Bun.serve<WebSocketData, object>({
	port: 3002,
	async fetch(req, server) {
		const url = new URL(req.url);
		console.log(`Request: ${req.method} ${req.url} (${url.pathname})`);

		if (url.pathname === path) {
			const session = await auth.api.getSession({
				headers: req.headers
			});

			if (!session) {
				console.log(`${chalk.red('No session found')}, returning 401`);
				return new Response('Unauthorized', { status: 401 });
			}

			if (server.upgrade(req, { data: { userId: session.user.id } })) {
				console.log(`${chalk.green('Upgrade successful')}`);
				return;
			} else {
				console.log(`${chalk.red('Upgrade failed')}`);
				return new Response('Upgrade failed', { status: 500 });
			}
		}

		console.log(`${chalk.red('Not a WebSocket request')}, returning 404`);
		return new Response('Not Found', { status: 404 });
	},
	websocket: {
		async open(ws) {
			console.log(chalk.green('Connection opened'));
			wsUsers.set(ws.data.userId, ws);

			const user = (await db.select().from(schema.user).where(eq(schema.user.id, ws.data.userId)))[0];
			if (!user) {
				console.warn(`User ${ws.data.userId} ${chalk.red('not found')}, closing connection`);
				ws.close();
				return;
			} else {
				console.log(`User ${user.name} ${chalk.green('found')}`);
			}

			// iterate through all of user's characters and add 0 exp to process any overdue level-ups (exp over goal) (should never happen ideally)
			const characters = await db.select().from(schema.character).where(eq(schema.character.userId, ws.data.userId));

			for (const character of characters) {
				console.log(`Processing character ${character.id} for user ${user.name}`);
				await ApplyExp(character.id, 0);
			}
		},
		async message(ws, message) {
			console.dir({ message });
		},
		close(ws, code, reason) {
			console.log(`Connection closed with code ${code} and reason: ${reason}`);
			wsUsers.delete(ws.data.userId);
		}
	}
});

console.log(`Websocket running on ws://localhost:${wsServer.port}${path} [${wsServer.development ? 'dev' : 'prod'}]`);
