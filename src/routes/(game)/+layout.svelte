<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import NavButton from '$lib/components/NavButton.svelte';

	const { children, data } = $props();

	let wsState: number | null = $state(null);

	onMount(() => {
		if (!data.session) {
			return;
		}

		if (!data.wsToken) {
			console.error('no websocket token sent? bwah what the hell bwah!!');
			return;
		}

		const url = (dev ? `ws://localhost:3002/api/ws` : `ws://${window.location.host}/api/ws`) + `?token=${data.wsToken}`;
		console.log(`Connecting to ${url}`);

		const ws = new WebSocket(url);

		ws.onopen = () => {
			wsState = ws.readyState;
			console.log('WS connected');
		};

		ws.onmessage = (event) => {
			console.log('WS message:', event.data);
		};

		ws.onerror = (error) => {
			wsState = ws.readyState;
			console.error('WS error:', error);
		};

		ws.onclose = () => {
			wsState = ws.readyState;
			console.log('WS connection closed');
		};

		return () => {
			console.log('Closing WS connection');
			ws?.close();
		};
	});
</script>

{#if data.character}
	<div class="fixed bottom-0 left-0 flex h-12 w-screen items-center justify-end gap-x-8 px-4 select-none">
		<p class="text-sm">
			WebSocket {wsState === WebSocket.OPEN ? 'connected' : 'disconnected'}
		</p>

		<div class="flex items-center gap-x-2">
			<NavButton icon="/svg/squares-four-fill.svg" href="/hub" label="Hub" />
			<NavButton icon="/svg/person-arms-spread-fill.svg" href="/character" label="Character" />
		</div>

		<div
			class="group hover:bg-brand flex h-8 items-center gap-x-2.5 rounded-full border border-neutral-900 bg-neutral-950 transition-all duration-75 hover:text-neutral-900"
		>
			<a class="flex h-8 cursor-pointer items-center gap-x-2 pl-4" href="/profile">
				<p>{data.session?.user.name}</p>
				<img
					class="mr-0.5 size-7 rounded-full border border-transparent transition-colors group-hover:border-neutral-950"
					src={data.session?.user.image}
					alt="Profile icon"
				/>
			</a>
		</div>
	</div>
{/if}

{@render children()}
