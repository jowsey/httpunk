import { eq } from 'drizzle-orm';
import { auth } from '../auth';
import { db, schema } from '../db';
import chalk from 'chalk';

const path = '/api/ws';

export const server = Bun.serve<{ userId: string }, object>({
	port: 3002,
	async fetch(req, server) {
		const url = new URL(req.url);
		console.log(`Request: ${req.method} ${req.url} (${url.pathname})`);

		if (url.pathname === path) {
			const token = url.searchParams.get('token');
			if (!token) {
				console.log(`${chalk.red('No token provided')}, returning 401`);
				return new Response('Unauthorized', { status: 401 });
			}

			const session = await auth.api.verifyOneTimeToken({
				body: { token }
			});

			console.dir({ token, user: session?.user?.name });

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

			const user = (await db.select().from(schema.user).where(eq(schema.user.id, ws.data.userId)))[0];
			if (!user) {
				console.warn(`User ${ws.data.userId} ${chalk.red('not found')}, closing connection`);
				ws.close();
				return;
			} else {
				console.log(`User ${ws.data.userId} (${user.name}) ${chalk.green('found')}`);
			}
		},
		async message(ws, message) {
			// const user = (await db.select().from(schema.user).where(eq(schema.user.id, ws.data.userId)))[0];
			console.dir({ message });
		},
		close(ws, code, reason) {
			console.log(`Connection closed with code ${code} and reason: ${reason}`);
		}
	}
});

console.log(`Server [${server.development ? 'dev' : 'prod'}] running on ws://localhost:${server.port}${path}`);
