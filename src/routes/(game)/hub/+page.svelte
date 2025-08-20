<script lang="ts">
	import { appState } from '$lib/client/state.svelte.js';
	import HubPanel from '$lib/components/HubPanel.svelte';
</script>

<div class="mb-8 flex items-center justify-between">
	<p class="text-3xl font-bold">Welcome back, {appState.character!.name}.</p>
	<p>this is some placeholder text</p>
</div>

<div class="grid auto-rows-[192px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
	<HubPanel
		title="Jobs"
		subtitle="Take on work around the city"
		background="render/briefcase_glass.webp"
		backgroundHover="render/briefcase_glass_animated.webp"
		href="/jobs"
		class="col-span-2 row-span-2 lg:col-span-3"
	/>

	<HubPanel
		title="Character"
		subtitle="Manage equipment and view stats"
		background="render/heart_glass.webp"
		href="/character"
		class="col-span-1 row-span-2"
	/>

	<div class="col-span-3 row-span-1 max-lg:hidden">
		<!-- reserved -->
	</div>

	<HubPanel
		title="Weapons"
		subtitle="Purchase weapons and other gear"
		background="render/ar_glass.webp"
		backgroundHover="render/ar_glass_animated.webp"
		class="col-span-2 row-span-1"
	/>
</div>
