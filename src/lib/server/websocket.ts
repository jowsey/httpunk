import { eq } from 'drizzle-orm';
import { auth } from './auth';
import { db } from './db';
import * as schema from './db/schema';

const path = '/api/ws';

const server = Bun.serve<{ token: string; userId: string }, object>({
	port: 3002,
	async fetch(req, server) {
		const url = new URL(req.url);
		console.log(`request received: ${req.method} ${req.url} (${url.pathname})`);

		if (url.pathname === path) {
			const token = url.searchParams.get('token');
			console.log(`WebSocket request with token: ${token}`);
			if (!token) {
				console.log('No token provided, returning 401');
				return new Response('Unauthorized', { status: 401 });
			}

			const session = await auth.api.verifyOneTimeToken({
				body: { token }
			});

			console.log(`user.name: ${session?.user?.name}`);

			if (!session) {
				console.log('no session found, returning 401');
				return new Response('Unauthorized', { status: 401 });
			}

			if (server.upgrade(req, { data: { token: session.session.token, userId: session.user.id } })) {
				console.log('ws upgrade successful');
				return;
			} else {
				console.log('ws upgrade failed');
				return new Response('upgrade failed', { status: 500 });
			}
		}

		console.log('not a WebSocket request, returning 404');
		return new Response('Not Found', { status: 404 });
	},
	websocket: {
		async open(ws) {
			const user = (await db.select().from(schema.user).where(eq(schema.user.id, ws.data.userId)))[0];
			if (!user) {
				console.log(`User with ID ${ws.data.userId} not found, closing connection`);
				ws.close();
				return;
			} else {
				console.log(`User with ID ${ws.data.userId} found: ${user}`);
			}

			console.log(`connection opened to user ${ws.data.userId}`);
			ws.send('wsg brah');
		},
		message(ws, message) {
			console.log('received message:', message);
			ws.send(`echo: ${message}`);
		},
		close(ws, code, reason) {
			console.log(`connection closed with code ${code} and reason: ${reason}`);
		}
	}
});

console.log(`Server running on ws://localhost:${server.port}${path}`);
