<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>httpunk</title>
</svelte:head>

<div class="flex min-h-dvh flex-col">
	{@render children()}
</div>
