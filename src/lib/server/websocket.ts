import { auth } from './auth';

const path = '/api/ws';

const server = Bun.serve<{ session: App.Locals['session'] }, object>({
	port: 3002,
	async fetch(req, server) {
		const url = new URL(req.url);
		console.log(`request received: ${req.method} ${req.url} (${url.pathname})`);

		if (url.pathname === path) {
			console.log(`Cookie: ${req.headers.get('cookie')}`);
			const session = await auth.api.getSession({ headers: req.headers });
			console.log(`user.name: ${session?.user?.name}`);
			console.log('session: ', session);

			if (!session) {
				console.log('no session found, returning 401');
				return new Response('Unauthorized', { status: 401 });
			}

			if (server.upgrade(req, { data: { session } })) {
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
		open(ws) {
			console.log(`connection opened to user ${ws.data.session?.user.name}`);
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
