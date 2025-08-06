import type { schema } from '$lib/server/db';

const appState = $state({
	character: undefined as typeof schema.character.$inferSelect | undefined
});

export { appState };
