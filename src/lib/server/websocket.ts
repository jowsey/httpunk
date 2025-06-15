import { auth } from './auth';

const server = Bun.serve({
	port: 3002,
	async fetch(req, server) {
		const url = new URL(req.url);
		console.log(`[srv] request received: ${req.method} ${req.url} (${url.pathname})`);

		if (url.pathname === '/api/ws') {
			const session = await auth.api.getSession({ headers: req.headers });
			console.log('[srv] session:', session);
			if (!session) {
				console.warn('[srv] no session found, returning 401');
				return new Response('Unauthorized', { status: 401 });
			}

			if (server.upgrade(req)) {
				console.log('[srv] ws upgrade successful');
				return;
			} else {
				console.error('[srv] ws upgrade failed');
				return new Response('upgrade failed', { status: 500 });
			}
		}

		console.log('[srv] not a WebSocket request, returning 404');
		return new Response('Not Found', { status: 404 });
	},
	websocket: {
		open(ws) {
			console.log('[ws] connection opened');
			ws.send('wsg brah');
		},
		message(ws, message) {
			console.log('[ws] received message:', message);
			ws.send(`echo: ${message}`);
		},
		close(ws, code, reason) {
			console.log(`[ws] connection closed with code ${code} and reason: ${reason}`);
		}
	}
});

console.log(`[ws] server running on ws://localhost:${server.port}/ws`);
