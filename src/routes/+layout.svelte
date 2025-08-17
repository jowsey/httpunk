<script lang="ts">
	import '../app.css';
	import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

<OverlayScrollbarsComponent
	options={{ scrollbars: { theme: 'os-theme-light', autoHide: 'move' } }}
	class="flex h-dvh flex-col"
>
	{@render children()}
</OverlayScrollbarsComponent>
