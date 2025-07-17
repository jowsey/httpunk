<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import NavButton from '$lib/components/NavButton.svelte';

	let { children, data } = $props();

	onMount(() => {
		const wsUrl = dev ? `ws://localhost:3002/api/ws` : `ws://${window.location.host}/api/ws`;
		console.log(`Connecting to ${wsUrl}`);

		const ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			console.log('WS connected');
		};

		ws.onmessage = (event) => {
			console.log('WS message:', event.data);
		};

		ws.onerror = (error) => {
			console.error('WS error:', error);
		};

		ws.onclose = () => {
			console.log('WS connection closed');
		};

		return () => {
			console.log('Closing WS connection');
			ws.close();
		};
	});
</script>

<div class="fixed bottom-0 flex h-12 w-screen items-center justify-end gap-x-8 px-4 select-none">
	<div class="flex items-center gap-x-2">
		<NavButton href="/home" label="Home"></NavButton>
		<NavButton href="/character" label="Character"></NavButton>
		<NavButton href="/map" label="Map"></NavButton>
		<NavButton href="/gigs" label="Gigs"></NavButton>
	</div>

	<div
		class="group hover:bg-brand flex h-8 items-center gap-x-2.5 rounded-full border border-neutral-900 transition-all duration-75 hover:text-black"
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

<div class="px-6 py-4">
	{@render children()}
</div>
