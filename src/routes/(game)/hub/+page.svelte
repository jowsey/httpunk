<script lang="ts">
	import { appState } from '$lib/client/state.svelte.js';
	import HubPanel from '$lib/components/HubPanel.svelte';
</script>

<div class="mb-8 flex items-center justify-between">
	<p class="text-2xl font-bold">Welcome back, {appState.character!.name}.</p>
	<p>this is some placeholder text</p>
</div>

<div class="grid auto-rows-[192px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
	<HubPanel
		title="Gigs"
		subtitle="Contact a fixer to find work"
		background="hub/briefcase_glass_still.webp"
		backgroundHover="hub/briefcase_glass.webp"
		class="col-span-2 row-span-2 lg:col-span-3"
	/>

	<HubPanel
		title="Weapons"
		subtitle="Purchase weapons and other gear"
		background="hub/ar_glass_still.webp"
		backgroundHover="hub/ar_glass.webp"
		class="col-span-2 row-span-1 md:col-span-1 lg:col-span-2"
	/>

	<HubPanel
		title="Character"
		subtitle="View and manage your character"
		background="https://placewaifu.com/image/200"
		class="col-span-1 row-span-2"
		href="/character"
	/>

	<HubPanel
		title="Inventory"
		subtitle="Manage your items and equipment"
		background="https://placewaifu.com/image/300"
		class="col-span-1 row-span-2"
	/>
</div>
