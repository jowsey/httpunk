<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { authClient } from '$lib/auth-client';
	import NavButton from '$lib/components/NavButton.svelte';

	const session = authClient.useSession();

	let { children } = $props();

	onMount(() => {
		const wsUrl = dev ? `ws://localhost:3002/api/ws` : `ws://${window.location.host}/api/ws`;
		console.log(`connecting to ${wsUrl}`);

		const ws = new WebSocket(wsUrl);
		console.log('ws created', ws);

		ws.onopen = () => {
			console.log('ws connected');
		};

		ws.onmessage = (event) => {
			console.log('message from server:', event.data);
		};

		ws.onerror = (error) => {
			console.error('ws error:', error);
		};

		ws.onclose = () => {
			console.log('ws connection closed');
		};

		return () => {
			console.log('closing ws connection');
			ws.close();
		};
	});
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

<div class="fixed bottom-0 flex h-12 w-screen items-center justify-end gap-x-8 px-4 select-none">
	<a class="hover:text-brand hover:italic" href="/">httpunk</a>

	<div class="flex items-center gap-x-2">
		<NavButton href="/" label="Overview"></NavButton>
		<NavButton href="/character" label="Character"></NavButton>
		<NavButton href="/map" label="Map"></NavButton>
		<NavButton href="/gigs" label="Gigs"></NavButton>
	</div>

	<div
		class="group hover:bg-brand flex h-8 items-center gap-x-2.5 rounded-full border border-neutral-900 transition-all duration-75 hover:text-black"
	>
		{#if $session.data}
			<a class="flex h-8 cursor-pointer items-center gap-x-2 pl-4" href="/profile">
				<p>{$session.data.user.name}</p>
				<img
					class="mr-0.5 h-7 rounded-full border border-transparent transition-colors group-hover:border-neutral-950"
					src={$session.data.user.image}
					alt="Profile icon"
				/>
			</a>
		{:else}
			<button
				class="flex h-8 cursor-pointer items-center gap-x-2.5 px-4 font-bold"
				onclick={async () => {
					await authClient.signIn.social({ provider: 'discord' });
				}}
			>
				<p>Log in</p>
				<img class="h-4 group-hover:invert" src="/svg/discord.svg" alt="Discord logo" />
			</button>
		{/if}
	</div>
</div>

<div class="px-6 py-4">
	{@render children()}
</div>
