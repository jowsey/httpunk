<script lang="ts">
	import { appState } from '$lib/client/state.svelte.js';
</script>

<div class="mb-4 flex items-center justify-between">
	<p class="text-2xl font-bold">Welcome back, {appState.character!.name}.</p>
	<!-- <p class="flex gap-x-4 tabular-nums">
		<span>{worldState.time?.format('YYYY-MM-DD')}</span><span>{worldState.time?.format('HH:mm')}</span>
	</p> -->
</div>