<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { appState } from '$lib/client/state.svelte';
	import { WebsocketClient } from '$lib/client/WebsocketHandler.svelte';
	import NavButton from '$lib/components/NavButton.svelte';

	import 'overlayscrollbars/overlayscrollbars.css';

	const { children, data } = $props();

	appState.character = data.character;

	let ws: WebsocketClient | null = $state(null);

	onMount(() => {
		if (!data.session) return;

		const url = dev ? `ws://localhost:3002/api/ws` : `ws://${window.location.host}/api/ws`;
		console.log(`[ws] connecting to ${url}`);

		ws = new WebsocketClient(url);

		return () => {
			ws?.close();
		};
	});
</script>

<!-- top header -->
<div class="fixed top-0 z-40 w-full">
	<div class="absolute -top-8 left-0 z-50 h-8 w-full shadow-sm shadow-white/25"></div>
	<div class="relative mb-8 h-8 bg-gradient-to-t from-transparent to-neutral-950 to-25%">
		<!-- fades content below -->
		<div class="size-full bg-gradient-to-t from-transparent to-slate-900 px-4">
			<!-- blue layer -->
			<div class="mx-auto flex h-full max-w-7xl items-center justify-between pt-0.5">
				<a href="/hub">
					<img
						src="/favicon.png"
						alt="httpunk logo"
						class="drop-shadow-brand/25 hover:drop-shadow-brand/75 size-6 drop-shadow-sm"
					/>
				</a>

				<!-- player details -->
				<p class="drop-shadow-sm drop-shadow-white/25">
					<a class="hover:underline" href="/character">{appState.character!.name}</a>
					<span class="mx-2 opacity-50">•</span>
					Lvl. <span class="text-brand drop-shadow-brand/25 drop-shadow-sm">{appState.character!.level}</span>
				</p>
			</div>
		</div>
	</div>
</div>

<!-- main game content -->
<div class="mx-auto w-full max-w-7xl px-4 py-16">
	{@render children()}
</div>

<!-- bottom nav menu -->
<div
	class="pointer-events-none fixed bottom-0 flex h-12 w-dvw justify-end bg-gradient-to-b from-transparent to-neutral-950 select-none"
>
	<div class="pointer-events-auto flex h-full items-center justify-end gap-x-4 px-4">
		<p class="text-sm">
			ws {ws?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'}
		</p>

		<div class="flex items-center gap-x-2">
			<NavButton icon="/svg/squares-four-fill.svg" href="/hub" label="Hub" />
			<NavButton icon="/svg/person-arms-spread-fill.svg" href="/character" label="Character" />
		</div>

		<a
			class={[
				'group hover:bg-brand flex h-8 items-center justify-center gap-x-2 rounded-full border border-neutral-900 bg-neutral-950 px-[1px] transition-all duration-75 hover:text-neutral-900',
				page.url.pathname === '/profile' && '!bg-brand !text-neutral-900'
			]}
			href="/profile"
		>
			<p class="pl-3.5 max-sm:hidden">{data.session?.user.name}</p>
			<div class="size-7">
				<img
					class="size-full rounded-full border border-transparent transition-transform group-hover:scale-110"
					src={data.session?.user.image}
					alt="Profile icon"
				/>
			</div>
		</a>
	</div>
</div>
